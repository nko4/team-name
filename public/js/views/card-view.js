define([
  'chaplin',
  'views/base/view',
  'templates/helpers/phraseToUnderscores',
  'text!templates/card.hbs'
], function(Chaplin, View, phraseToUnderscores, template){
  'use strict';

  var view = View.extend({
    template : template,
    className : 'card-container'
  });

  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);

    var self = this;
    if(this.model.get('duration')){
      var duration  = this.model.get('duration');
      var time      = duration;
      setInterval(function(){
        time -= 1000;

        var progressWidth = time/duration * 100 + '%'
        $(self.el).find('.progress-bar').width(progressWidth);
      }, 1000);
    }
  };

  return view;
});