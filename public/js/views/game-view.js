define([
  'chaplin',
  'views/base/view',
  'text!templates/gameView.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template : template,
    regions       : {
      'watchers'   : '#watchers',
      'actor'      : '#actor',
      'card'       : '#cardHint',
      'guessInput' : '#guessInput',
      'guessHistory': '#guessHistory',
      'actorQueue'  : '#actorQueue',
      'players'     : '#players'
    },
    events : {
      'click .volunteer' : 'volunteer'
    },
    className : 'gameWrapper'
  });

  view.prototype.volunteer = function(first_argument) {
    this.publishEvent('joinQueue');
  };

  return view;
});