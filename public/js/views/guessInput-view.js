define([
  'chaplin',
  'views/base/view',
  'text!templates/guessInput.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    events    : {
      'click button' : 'makeGuess',
      'keyup input'  : 'updateGuess'
    },
    updateGuess : function(e) {
      this.guess = e.currentTarget.value;
      if (e.keyCode === 13) { this.makeGuess(); }
    },
    makeGuess : function () {
      this.trigger('guess', { guess: this.guess });
    }
  });

  return view;
});