require.config({
  baseUrl     : '/js/',
  paths       : {
    'underscore'  : './vendor/underscore.min',
    'socketio'    : './vendor/socket.io.min',
    'jquery'      : './vendor/jquery',
    'backbone'    : './vendor/backbone',
    'chaplin'     : './vendor/chaplin',
    'text'        : './vendor/requirejs-text',
    'handlebars'  : './vendor/handlebars',
    'bootstrap'   : './vendor/bootstrap',
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
    }
  },
  urlArgs             : 'bust=' + new Date().getTime()
});