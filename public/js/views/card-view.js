define([
  'chaplin',
  'views/base/view',
  'templates/helpers/phraseToUnderscores',
  'text!templates/card.hbs'
], function(Chaplin, View, phraseToUnderscores, template){
  'use strict';

  var view = View.extend({
    template : template
  });

  return view;
});