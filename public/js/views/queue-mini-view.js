define([
  'chaplin',
  'views/base/view',
], function(Chaplin, View){
  'use strict';

  var view = View.extend({
    className : 'thumbnail'
  });

  view.prototype.render = function(){
    var uid = 'uid_' + this.model.get('id');
    var clone = $('#' + uid).clone();
    $(this.el).html(clone);
    $(this.el).attr('id', this.model.get('id'));
  }

  return view;
});