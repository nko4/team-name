// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('GyZ8DfzBgxFRPioc');

// Modules & configs
var CloakServer, cloak,
    http = require('http'),
    path = require('path'),
    express = require('express'),
    routes = require('./routes'),
    game = require('./routes/game'),
    isProduction = (process.env.NODE_ENV === 'production'),
    port = isProduction ? 80 : 8000,
    app = express(),
    server = http.createServer(app),
    opentok = require('./opentok'),
    _ = require('underscore'),
    io = require('socket.io').listen(server),
    RoomManager = require('./rooms/room_manager');

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
app.get('/',                routes.index);
app.get('/game/:id',        routes.index);
app.get('/lobby',           game.lobby);
app.get('/play',            game.play);

// ROW-BRO!
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    var room_manager = new RoomManager(io);
    room_manager.on('room_created', function (room) {
        opentok.get_session_id(room.name, function (err, session_id) {
            room.set_session_id(session_id);
        });
    });
});