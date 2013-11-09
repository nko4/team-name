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
      'actor'      : '#actor'
    },
    events : {
      'click .join-queue'       : 'joinQueue'
    }
  });

  view.prototype.joinQueue = function() {
    console.log('clicked');
    this.publishEvent('joinQueue');
  };

  return view;
});