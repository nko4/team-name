define([
  'chaplin',
  'views/base/view',
  'text!templates/webcamReminder.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template    : template,
    attributes  : {
      'id' : 'webcamReminder'
    },
    events : {
      'click .close' : 'killReminder'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    setTimeout(function(){
      $('#webcamReminder').addClass('animate-in');
    });
  };


  view.prototype.killReminder = function(){
    var self = this;
    $(this.el).removeClass('show');
    setTimeout(function(){
      $(self).dispose();
    }, 500);
  };


  return view;
});