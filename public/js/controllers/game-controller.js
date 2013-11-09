define([
  'chaplin',
  'controllers/base/controller',
  'views/game-view',
  'views/webcamReminder-view'
], function(Chaplin, Controller, GameView, WebCamView){
  'use strict';

  var gameController = Controller.extend({

    wait : function(){
      socket.emit('join');
    },

    play : function(params){

      // Handle the opentok session connection stuff
      //TB.setLogLevel(TB.NONE);
      var self    = this;
      var api_key = '44393472';
      this.game   = {
        session   : TB.initSession(params.session_id)
      }
      this.game.session.connect(api_key, params.token);

      self.game.session.on('sessionConnected', on_session_connected);
      self.game.session.on('streamCreated', on_stream_created);

      // TODO - clean all this shit up a bit
      var log = function () {
        console.log.apply(console, arguments);
      };

      function on_session_connected (event) {
        log('session created', event);
        self.game.session.publish(self.game.publisher);
        subscribe_to_streams(event.streams);
      }

      function on_stream_created(event) {
        log('stream created', event);
        subscribe_to_streams(event.streams);
      }

      function subscribe_to_streams(streams) {
        if (!self.game.session)
            return;

        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            if (stream.connection.connectionId != self.game.session.connection.connectionId) {
                self.game.session.subscribe(stream, get_element_id_for_stream(stream));
                log('subscribing to stream ', stream);
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
})