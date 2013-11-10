define([
  'chaplin',
  'views/base/view',
  'text!templates/guessInput.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    events    : {
      'click button'      : 'makeGuess',
      'keyup #userGuess'  : 'updateGuess'
    },
    disableInput : function () {
      var $this = $(this.el);
      $this.find('#userGuess').addClass('disable').attr('disabled', true);
      $this.find('button').addClass('disable').attr('disabled', true);
    },
    enableInput : function () {
      var $this = $(this.el);
      $this.find('#userGuess').addClass('disable').attr('disabled', false);
      $this.find('button').addClass('disable').attr('disabled', false);
    },
    updateGuess : function (e) {
      this.guess = e.currentTarget.value;
      if (e.keyCode === 13) { this.makeGuess(); }
    },
    makeGuess : function () {
      if (!this.guess || this.guess.trim().length == 0) return;
      this.trigger('guess', { guess: this.guess });
      $(this.el).find('#userGuess').val('')
    }
  });


  view.prototype.initialize = function () {
    Chaplin.View.prototype.render.apply(this, arguments);
    var self = this;
    var bitly_uri = "https://api-ssl.bitly.com/shorten?callback=?&access_token=74b52c220435d964a2e7b4806cf42300e6a7af55&longUrl=" + encodeURI(window.location.href);

    $.getJSON(bitly_uri, function (response) {
      if (response.errorCode) {
        $('#shortUrl').val(window.location.href);
      } 
      else {
        $('#shortUrl').val(response.data.url);  
      }
    });

    this.on('new_card', function(){
      $(self.el).find('#userGuess').val('')
    });
  };

  return view;
});