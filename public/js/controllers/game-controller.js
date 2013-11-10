define([
  'chaplin',
  'controllers/base/controller',
  'models/base/model',
  'models/base/collection',
  'views/game-view',
  'views/webcamReminder-view',
  'views/guessHistory-view',
  'views/guessInput-view',
  'views/card-view',
  'views/queueCollection-view',
  'views/playerCollection-view',
  'jquery-cookie'
], function(Chaplin, Controller, Model, Collection, GameView, WebCamView, GuessHistoryView, GuessInputView, CardView, QueueCollectionView, PlayerCollectionView, jQueryCookie){
  'use strict';

  var gameController = Controller.extend({

    idle : function() {
      if (window.game.game_name) {
        Chaplin.helpers.redirectTo('game#play', { game_name: window.game.game_name});
      }
    },

    // Join a random game
    wait : function(){
      socket.emit('join', { name: $.cookie('frazy.username') });
    },

    play : function(params){      
      TB.setLogLevel(0);

      if (!window.game.game_name) {
        socket.emit('join', { name: $.cookie('frazy.username'), game_name: params.game_name });
        return Chaplin.helpers.redirectTo('game#idle')
      }

      window.trackEvent('game', 'name', window.game.game_name);

      var api_key   = '44393472';
      var self      = this;
      var players   = new Collection();
      var queueCollection = new Collection();
      var cardModel = new Model();
      var cardView  = null;

      window.playas = players;
      // View Handling
      this.view = new GameView({
        autoRender  : true,
        region      : 'main'
      });
      var webcamview = new WebCamView({
        autoRender  : true,
        region      : 'notifier'
      });
      var playersview = new PlayerCollectionView({
        autoRender  : true,
        region      : 'players',
        collection  : players
      });
      var guesshistoryview = new GuessHistoryView({
        autoRender  : true,
        region      : 'guessHistory'
      });
      var guessinputview = new GuessInputView({
        autoRender  : true,
        region      : 'guessInput'
      });
      var cardView = new CardView({
        autoRender  : true,
        region      : 'card',
        model       : cardModel
      });

      // On page load
      socket.emit('info', function(data){
        // add the players
        if(data.players) players.add(data.players);
        // mark a player as the actor... maybe
        if(data.stage.player){
          var actor = players.findWhere({ id : data.stage.player.id });
          actor.set({ actor : true });
        }
        // Update a card if late joining the game
        if(data.phrase){
          cardModel.set(data.phrase);
          cardView.render();
        }
        // Add players to the queue
        if(data.queue) queueCollection.add(data.queue);
      });

      guessinputview.on('guess', function (e) {
        window.trackEvent('game', 'guess');
        socket.emit('guess', e.guess);
      });

      socket.on('bad_guess', function (e) {
        guesshistoryview.addHistory(e.guess);
        players.findWhere({ id: e.player.id }).trigger('bad_guess', e);
      });

      socket.on('correct_guess', function (e) {
        players.findWhere({ id: e.player.id }).trigger('correct_guess', e);
        players.findWhere({ id: e.stage.id }).trigger('acting_points', e);
      });

      this.subscribeEvent('joinQueue', function(){
        window.trackEvent('game', 'enqueue');
        socket.emit('enqueue');
      });

      this.subscribeEvent('leaveQueue', function(){
        window.trackEvent('game', 'dequeue');
        socket.emit('dequeue');
      });

      socket.on('start', function(data){
        console.log('start', data);
      });

      socket.on('stage_clear', function(data){
        players.each(function(item){
          item.set({ 'actor' : false });
        });

        cardModel.reset();
      });

      // Listen for stage chane events to update the actor attribute
      socket.on('stage_change', function(data){
        players.each(function(item){
          item.set({ 'actor' : false });
        });

        var player = players.findWhere({ id : data.player.id });
        if(player) player.set({ 'actor' : true });
      });

      var queueCollectionView = new QueueCollectionView({
          autoRender : true,
          collection : queueCollection,
          region     : 'actorQueue',
          session    : session,
          api_key    : api_key
      });

      socket.on('winner', function (e) {
        var $player = $('#uid_'+e.id);
        window.trackEvent('game', 'winner');
        var $yay = $('#winner').removeClass('hidden');
        
        setTimeout(function(){
          $yay.addClass('falldown');
        },10);

        setTimeout(function(){
          $yay.find('.info').append($player.clone());
        },3000);
      });

      socket.on('queue_updated', function(queue){
        queueCollection.reset();
        queueCollection.add(queue);
        queueCollectionView.renderAllItems();

        self.publishEvent('queue_updated', queue);
      });

      socket.on('new_phrase', function(data){
        // Clear out the guess inputs when cards change
        guessinputview.trigger('new_card')
        guesshistoryview.clearHistory();

        // Re render the card view
        cardModel.reset();
        cardModel.set(data);
        cardView.render()
      });

      // Connect to opentok
      var session = TB.initSession(window.game.session_id);
      session.connect(api_key, window.game.token);

      // When connected, create self
      var vidOptions = {
        publishAudio  : true,
        publishVideo  : true,
        width         : 370,
        height        : 150
      };

      window.mySocketId = 0;
      session.on('sessionConnected', function(e){
        window.mySocketId = socket.socket.sessionid;

        var player = new Model({ 
          'id'    : socket.socket.sessionid, 
          'me'    : true,
          'TB_id' : null
        });
        
        players.add(player);
        
        var view = playersview.initItemView(player);
        var publisher = TB.initPublisher(api_key, 'uid_' + socket.socket.sessionid, vidOptions);

        session.publish(publisher);
        subscribeToStreams(e.streams);

        $('#userGuess').focus();
        $(window).scrollTop(0);
      });


      session.on('streamDestroyed', function(e){
        for(var i in e.streams){
          var player = players.findWhere({ TB_id : e.streams[i].id });
          if(typeof player !== 'undefined') {
            player.collection.remove(player);
          }
        }
      });

      // Listen for others to join
      session.on('streamCreated', function(e){
        webcamview.killReminder();
        subscribeToStreams(e.streams);
      });

      // Are players leaving?
      session.on('players', function(e){
        console.log(e)
      });

      $(document).on('click', '.gohome', function(e) {
        e.preventDefault();
        var gohome = confirm('This will take you out of the game, are you sure?');
        if (gohome) window.location = '/';
        return false;
      });

      // Cool working code
      var subscribeToStreams = function(streams) {
        if (!session) return;

        for (var i = 0; i < streams.length; i++) {
          var stream = streams[i];
          if (stream.connection.connectionId != session.connection.connectionId) {
            var socketId = stream.connection.data.replace('socket_id:', '');
            var player = new Model({ 
              'id' : socketId,
              'TB_id' : stream.id
            });
            players.add(player);
            playersview.initItemView(player);

            session.subscribe(stream, 'uid_' + socketId);
          }
        }
      };

    }

  });

  return gameController;
});
