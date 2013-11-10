define([
  'chaplin',
  'views/base/view',
  'text!templates/player.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    className : 'player',
    listen : {
      'change:actor model' : 'adjustActorRole'
    }
  });

  view.prototype.adjustActorRole = function(e){
    if(this.model.get('actor')) $(this.el).addClass('actor')
    else $(this.el).removeClass('actor')
  };

  view.prototype.correct_guess = function(e){

  };

  view.prototype.bad_guess = function(e){

  };

  return view;
});