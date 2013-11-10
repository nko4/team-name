define([
  'chaplin',
  'views/site-view',
  'models/base/model'
], function(Chaplin, SiteView, Model){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      Chaplin.Controller.prototype.beforeAction.apply(this, arguments);

      this.compose('site', SiteView);

      if(arguments[1].action == 'play') {
        $('#site-navigation').hide();
        $('#vote-arrows').show();
      } else {
        $('#site-navigation').show();
        $('#vote-arrows').hide();
      }

    }
  });

  return Controller;
});