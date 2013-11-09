define([
  'chaplin',
  'views/base/view',
  'text!templates/homeView.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template : template
  });

  return view;
});