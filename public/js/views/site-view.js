define([
  'views/base/view',
  'text!templates/site.hbs'
], function(View, template){

  var view = View.extend({
    container : 'body',
    id        : 'site-container',
    template  : template,
    regions   : {
      notifier  : '#notifier',
      main      : '#main-container'
    }
  });

  return view;
});