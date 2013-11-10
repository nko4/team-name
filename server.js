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
    GameManager = require('./game/game_manager'),
    MongoClient = require('mongodb').MongoClient,
    config = require('./config');

// all environments
    app.set('port', port);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
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
app.get('/',            routes.index);
app.get('/game/:id',    routes.index);
app.get('/lobby',       game.lobby);
app.get('/play',        game.play);
app.get('/reload_data', function (req, res) {
    require('./game/phrase_store').load_data();
    res.end();
});

// ROW-BRO!
MongoClient.connect(config.MONGO_DB_CONNECTION, function (err, db) {
    if (err) throw err;
    
    console.log('Connected to mongodb');
    
    //Gotta load the phrases or we're no good
    require('./game/phrase_store').initialize(db, function () {
        start_server(db);
    });
});

var start_server = function (db) {
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
        var game_manager = new GameManager(io, db);

        game_manager.on('game_created', function (game) {
            var emit_to_players = function (message, args) {
                game.players.forEach(function (p) {
                    p.emit(message, args)
                });
            };

            var send_token = function (p) {
                if (!game.session_id) return;
                var token = opentok.get_token(game.session_id, p.id);
                p.emit('session', { session_id: game.session_id, token: token, socket_id: p.id });
            };

            game.on('player_joined', function (p) {
                send_token(p);
            });

            game.on('session_joined', function () {
                game.players.forEach(function (p) {
                    send_token(p);
                });
            }); 

            opentok.get_session_id(game.name, function (err, session_id) {
                game.set_session_id(session_id);
            });
        });
    });
};