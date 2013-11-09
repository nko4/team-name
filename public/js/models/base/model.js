define([
  'chaplin'
], function(Chaplin) {
  'use strict';

  var Model = Chaplin.Model.extend({
    params  : {},
    listen  : function(next){
      var model = this;

      socket.request(this.url, this.params, function(results){
        model.set(results);
        if(next) next(results)
      });

      socket.on('message', function(message){
        // Loop over the message data and decide id the params match
        if(message.verb == 'update'){
          var truths  = 0;
          var keys    = Object.keys(model.params);
          for(var i = 0; i<keys.length; i++){
            if(message[keys[i]] == model.params[keys[i]]) truths++
            else if(message.data[keys[i]] == model.params[keys[i]]) truths++
          }

          if(truths >= keys.length) model.set(message.data);
        }
      });
    }
  });

  return Model;
});
