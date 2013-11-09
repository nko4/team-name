define([
  'chaplin',
  'controllers/base/controller',
  'views/game-view',
  'views/webcamReminder-view'
], function(Chaplin, Controller, GameView, WebCamView){
  'use strict';

  var gameController = Controller.extend({

    play : function(){
      this.view = new GameView({
        autoRender  : true,
        region      : 'notifier'
      });
    },

  });

  return gameController;
})