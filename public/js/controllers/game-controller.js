define([
  'chaplin',
  'controllers/base/controller',
  'models/base/model',
  'views/game-view',
  'views/watcher-view',
  'views/webcamReminder-view',
  'views/guessHistory-view',
  'views/guessInput-view',
  'views/card-view',
], function(Chaplin, Controller, Model, GameView, WatcherView, WebCamView, GuessHistoryView, GuessInputView, CardView){
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
      var createNewWatcherView = function(){
        var domID       = _.uniqueId('watcher_');
        var watcherView = new WatcherView({
          autoRender  : true,
          region      : 'watchers',
        });
        watcherView.setDomId(domID);

        return domID;
      };

      this.subscribeEvent('joinQueue', function(){
        socket.emit('enqueue');
      });

      socket.on('queue_updated', function(queue){
        console.log('queue', queue);
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
        var publisher = TB.initPublisher(api_key, createNewWatcherView(), vidOptions);
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
            session.subscribe(stream, createNewWatcherView());
          }
        }
      };

    }

  });

  return gameController;
});
