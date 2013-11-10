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

  view.prototype.initialize = function () {
    Chaplin.View.prototype.render.apply(this, arguments);
    _.bindAll(this, 'correct_guess', 'bad_guess', 'acting_points');
    this.model.on('correct_guess', this.correct_guess);
    this.model.on('bad_guess', this.bad_guess);
    this.model.on('acting_points', this.acting_points);
  };
  
  view.prototype.acting_points = function (e) {
    $this.find('.score').text(e.stage.score);
  };

  view.prototype.adjustActorRole = function(e){
    if(this.model.get('actor')) $(this.el).addClass('actor');
    else $(this.el).removeClass('actor');
  };

  view.prototype.correct_guess = function (e) {
    var $this = $(this.el).addClass('correct_guess');
    var $guess = $this.find('.guess').text(e.guess).addClass('in');
    $this.find('.score').text(e.player.score);
    setTimeout(function(){
      $guess.removeClass('in');
    },2000);
    setTimeout(function(){
      $this.removeClass('correct_guess');
    },4000);
  };

  view.prototype.bad_guess = function (e) {
    var $this = $(this.el).addClass('bad_guess');
    var $guess = $this.find('.guess').text(e.guess).addClass('in');
    $this.find('.score').text(e.player.score);
    setTimeout(function(){
      $guess.removeClass('in');
    },2000);
    setTimeout(function(){
      $this.removeClass('bad_guess');
    },4000);
  };

  return view;
});