define([
  'chaplin',
  'views/site-view',
  'models/base/model'
], function(Chaplin, SiteView, Model){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      Chaplin.Controller.prototype.beforeAction.apply(this, arguments);

      // Hide the header if playing
      if(arguments[1].action == 'play') $('#site-navigation').hide();
      else $('#site-navigation').show()

      this.compose('site', SiteView);
    }
  });

  return Controller;
});