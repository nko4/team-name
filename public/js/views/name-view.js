define([
  'chaplin',
  'views/base/view',
  'text!templates/nameView.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    template  : template,
    events    : {
      'click button' : 'save',
      'keyup input'  : 'handleKey'
    },
    render: function () {
      Chaplin.View.prototype.render.apply(this, arguments);
      $('#userName').val($.cookie('user_name'));
    },
    handleKey: function (e) {
      if (e.keyCode === 13) { this.save(); }
    },
    save : function () {
      $.cookie('user_name', $('#userName').val());
    }
  });

  return view;
});