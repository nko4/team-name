define([
  'chaplin',
  'views/base/view',
  'text!templates/player.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    className : 'watcher'
  });

  view.prototype.setDomId = function(id){
    $(this.el).find('.video').attr('id', id);
  };


  view.prototype.correct_guess = function(e){

  };

  view.prototype.bad_guess = function(e){

  };

  return view;
});