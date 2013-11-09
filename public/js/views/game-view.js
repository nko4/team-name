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
    }
  });

  return view;
});