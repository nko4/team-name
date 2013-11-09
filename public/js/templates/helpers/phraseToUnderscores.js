define([
  'handlebars'
], function(Handlebars){
  'use strict';

  var phraseToUnderscores = function(phrase, opts){
    var ret = '';
    for(var i=0; i<phrase.length; i++){
      var result = phrase[i] == ' ' ? ' ' : '_';
      ret += result
    }

    return ret
  }

  Handlebars.registerHelper('phraseToUnderscores', phraseToUnderscores);
  return new Handlebars.SafeString(phraseToUnderscores);
});