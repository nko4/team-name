define([
  'chaplin',
  'controllers/base/controller',
  'models/base/model',
  'models/base/collection',
  'views/game-view',
  'views/watcher-view',
  'views/webcamReminder-view',
  'views/guessHistory-view',
  'views/guessInput-view',
  'views/card-view',
  'views/queueCollection-view',
], function(Chaplin, Controller, Model, Collection, GameView, WatcherView, WebCamView, GuessHistoryView, GuessInputView, CardView, QueueCollectionView){
  'use strict';

  var gameController = Controller.extend({

    wait : function(){
      socket.emit('join');
    },

    play : function(params){
      var self      = this;

      // View Handling
      this.view = new GameView({
        autoRender  : true,
        region      : 'main'
      });
      var webcamview = new WebCamView({
        autoRender  : true,
        region      : 'notifier'
      });
      var guesshistoryview = new GuessHistoryView({
        autoRender  : true,
        region      : 'guessHistory'
      });
      var guessinputview = new GuessInputView({
        autoRender  : true,
        region      : 'guessInput'
      });

      guessinputview.on('guess', function (data) {
        guesshistoryview.addHistory(data.guess);
        // send to server, if it's correct
        // if its incorrect, add to guessed items
      });

      // When new people join, this view gets built
      var createNewWatcherView = function(uid){
        var domId = 'uid_' + uid;
        var watcherView = new WatcherView({
          autoRender  : true,
          region      : 'watchers',
        });
        watcherView.setDomId(domId);

        return domId;
      };

      this.subscribeEvent('joinQueue', function(){
        socket.emit('enqueue');
      });

      socket.on('queue_updated', function(queue){
        var queueCollection = new Collection(queue);
        var queueCollectionView = new QueueCollectionView({
          autoRender : true,
          collection : queueCollection,
          region     : 'actorQueue',
          session    : session
        })
      });

      socket.on('new_phrase', function(data){
        var cardModel = new Model(data);
        $('#cardHint').html('');
        var cardView  = new CardView({
          autoRender  : true,
          region      : 'card',
          model       : cardModel
        });
      });

      // Connect to opentok
      var api_key   = '44393472';
      var session   = TB.initSession(params.session_id);
      session.connect(api_key, params.token);

      // When connected, create self
      var vidOptions = {
        publishAudio  : false,
        publishVideo  : true,
        width         : 150,
        height        : 150
      };
      session.on('sessionConnected', function(e){
        var publisher = TB.initPublisher(api_key, createNewWatcherView(socket.socket.sessionid), vidOptions);
        session.publish(publisher);
        subscribeToStreams(e.streams);
      });

      // Listen for others to join
      session.on('streamCreated', function(e){
        subscribeToStreams(e.streams);
      });

      // Cool working code
      var subscribeToStreams = function(streams) {
        if (!session) return;

        for (var i = 0; i < streams.length; i++) {
          var stream = streams[i];
          if (stream.connection.connectionId != session.connection.connectionId) {
            session.subscribe(stream, createNewWatcherView(stream.connection.connectionId));
          }
        }
      };

    }

  });

  return gameController;
});
