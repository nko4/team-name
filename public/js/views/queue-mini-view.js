define([
  'chaplin',
  'views/base/view',
  'text!templates/queueMini.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template : template,
    className : 'thumbnail'
  });

  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    console.log(this.options.session)
    //session.subscribe(stream, createNewWatcherView(stream.connection.connectionId));
  }

  return view;
});