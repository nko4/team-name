// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('GyZ8DfzBgxFRPioc');
var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);
var cloakPort = 8080;

var express = require('express');
var routes = require('./routes');
var game = require('./routes/game');
var http = require('http');
var path = require('path');
var cloak = require('cloak');
//var _ = require('underscore');

// server.js
cloak.configure({
  port: cloakPort,
  messages: {
    get_room_id: function(msg, user) {
      console.log('get room id called')
    }
  }
});

cloak.run();

var app = express();

// all environments
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.directory(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);
app.get('/lobby', game.lobby);
app.get('/play', game.play);

// ROW-BRO!
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});