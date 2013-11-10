define([
  'chaplin',
  'views/base/view',
  'text!templates/player.hbs',
  'views/name-view'
], function(Chaplin, View, template, NameView){
  'use strict';

  var view = View.extend({
    template  : template,
    className : 'player',
    regions : {
      user_name: '.user_name_entry'
    }
  });

  view.prototype.append_name_entry = function (e) {
    var view = new NameView({ region: 'user_name' }); 
    $(this.el).append(view.render().el);
  };

  view.prototype.correct_guess = function (e) {

  };

  view.prototype.bad_guess = function (e) {

  };

  return view;
});