define([
  'chaplin',
  'controllers/base/controller',
  'views/home-view'
], function(Chaplin, Controller, HomeView){
  'use strict';

  var homeController = Controller.extend({

    intro : function(){
      var view = new HomeView();
    },

  });

  return homeController;
})