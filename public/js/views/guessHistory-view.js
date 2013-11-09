define([
  'chaplin',
  'views/base/view',
  'text!templates/guessHistory.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template : template,
    addHistory : function (word) {
      var $log = $(this.el).find('.historyLog');
      var string = $log.text();

      string += string.length < 1 ? '' : ', ';
      string += word;

      $log.text(string);
    }
  });

  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'addHistory');
  };

  return view;
});