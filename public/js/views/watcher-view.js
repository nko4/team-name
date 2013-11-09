define([
  'chaplin',
  'views/base/view',
  'text!templates/watcher.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    className : 'col-sm-6 col-md-3'
  });

  view.prototype.setDomId = function(id){
    $(this.el).find('.thumbnail').attr('id', id);
  }


  return view;
});