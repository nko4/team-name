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
    }
  });

  return Controller;
});