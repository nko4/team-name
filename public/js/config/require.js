require.config({
  baseUrl     : '/js/',
  paths       : {
    'underscore'      : './vendor/underscore.min',
    'socketio'        : './vendor/socket.io.min',
    'jquery'          : './vendor/jquery',
    'backbone'        : './vendor/backbone',
    'chaplin'         : './vendor/chaplin',
    'text'            : './vendor/requirejs-text',
    'handlebars'      : './vendor/handlebars',
    'bootstrap'       : './vendor/bootstrap',
    'jquery-cookie'   : './vendor/jquery-cookie',
  },
  shim        : {
    underscore    : {
      exports         : '_'
    },
    socketio      : {
      exports         : 'io'
    },
    backbone      : {
      deps            : ['underscore', 'jquery'],
      exports         : 'Backbone'
    },
    chaplin       : {
      deps            : ['backbone'],
      exports         : 'chaplin'
    },
    handlebars    : {
      exports         : 'Handlebars'
    },
    bootstrap     : {
      deps            : ['jquery'],
      exports         : 'bootstrap'
    },
    cookie        : {
      deps            : ['jquery'],
      exports         : 'jquery-cookie'
    }
  },
  urlArgs             : 'bust=' + new Date().getTime()
});