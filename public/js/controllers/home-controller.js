define([
  'chaplin',
  'controllers/base/controller',
  'views/home-view',
  'views/webcamReminder-view'
], function(Chaplin, Controller, HomeView, WebCamView){
  'use strict';

  var homeController = Controller.extend({

    intro : function(){
      this.view = new WebCamView({
        autoRender  : true,
        region      : 'notifier'
      });
    },

  });

  return homeController;
})