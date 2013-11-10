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
    disableInput : function () {
      var $this = $(this.el);
      $this.find('input').addClass('disable').attr('disabled', true);
      $this.find('button').addClass('disable').attr('disabled', true);
    },
    enableInput : function () {
      var $this = $(this.el);
      $this.find('input').addClass('disable').attr('disabled', false);
      $this.find('button').addClass('disable').attr('disabled', false);
    },
    updateGuess : function (e) {
      this.guess = e.currentTarget.value;
      if (e.keyCode === 13) { this.makeGuess(); }
    },
    makeGuess : function () {
      this.trigger('guess', { guess: this.guess });
      $(this.el).find('input').val('')
    }
  });


  view.prototype.initialize = function () {
    Chaplin.View.prototype.render.apply(this, arguments);
    var self = this;
    this.on('new_card', function(){
      $(self.el).find('input').val('')
    });
  };

  return view;
});