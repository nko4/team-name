define([
  'chaplin',
  'views/base/view',
  'text!templates/queueMini.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template : template,
    className : 'thumbnail'
  });

  view.prototype.render = function(){
    var uid = 'uid_' + this.model.get('id');
    var clone = $('#' + uid).clone();
    $(this.el).html(clone);
  }

  return view;
});