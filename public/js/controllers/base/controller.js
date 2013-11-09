define([
  'chaplin',
  'views/site-view',
  'models/base/model'
], function(Chaplin, SiteView, Model){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      Chaplin.Controller.prototype.beforeAction.apply(this, arguments);

      // Always compose the site view unless looking at a newlsetter preview
      if(arguments[1].action == 'preview' && arguments[1].controller == 'newsletter'){}
      else {this.compose('site', SiteView)};

      // Create a new me instance and bind to the socket
      if(!window.me){
        window.me     = new Model(window.meAsPlainObject);
        window.me.url = '/user/' + me.get('id');
        window.me.listen();
      }
    }
  });

  return Controller;
});