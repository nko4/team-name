define([
  'chaplin',
  'controllers/base/controller',
  'views/game-view',
  'views/watcher-view',
  'views/webcamReminder-view'
], function(Chaplin, Controller, GameView, WatcherView, WebCamView){
  'use strict';

  var gameController = Controller.extend({

    wait : function(){
      socket.emit('join');
    },

    play : function(params){

      // Handle the opentok session connection stuff
      var self    = this;
      var api_key = '44393472';
      this.game   = {
        session   : TB.initSession(params.session_id)
      }
      this.game.session.connect(api_key, params.token);

      this.game.session.on('sessionConnected', function(e){
        var publisher = TB.initPublisher(api_key, createNewWatcherView());
        subscribeToStreams(e.streams);
      });

      this.game.session.on('streamCreated', function(e){
        subscribeToStreams(e.streams);
      });

      var createNewWatcherView = function(){
        var domID       = _.uniqueId('watcher_');
        var watcherView = new WatcherView({
          autoRender  : true,
          region      : 'watchers',
        });
        watcherView.setDomId(domID);

        return domID;
      };

      var subscribeToStreams = function(streams) {
        //if (!self.game.session) return;

        console.log(streams);

        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            alert('new person')
            console.log(stream);
            console.log(self.game.session);
            if (stream.connection.connectionId != self.game.session.connection.connectionId) {
                self.game.session.subscribe(stream, createNewWatcherView());
            }
        }
      }

      var get_element_id_for_stream = function (stream) {
        return 'viewer_' + self.game.player_count;
      };


      // View handling
      var webcamview = new WebCamView({
        autoRender  : true,
        region      : 'notifier'
      });

      this.view = new GameView({
        autoRender  : true,
        region      : 'main'
      });

    }

  });

  return gameController;
});
