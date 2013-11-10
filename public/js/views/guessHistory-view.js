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
      $log.append('<li>' + word + '</li>')
    },
    clearHistory : function(){
      $(this.el).find('.historyLog').html('');
    }
  });

  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'addHistory');
  };

  return view;
});