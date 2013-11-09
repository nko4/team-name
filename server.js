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
    opentok = require('./opentok'),
    _ = require('underscore');

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
app.get('/',        routes.index);
app.get('/lobby',   game.lobby);
app.get('/play',    game.play);

// ROW-BRO!
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

    // Create / config CloakServer (sockets dawg!!!)
    CloakServer = require('./controllers/cloak');
    cloak = new CloakServer({
        port            : 8080,
        defaultRoomSize : 6,                // limiting to 6 per room for now
        autoJoinLobby   : true,             // everyone is in the lobby by default
        autoCreateRooms : true,             // new rooms when we need them
        minRoomMembers  : 2,
        pruneEmptyRooms : 600000,           // Empty rooms after 10 min
        reconnectWait   : null,             // wait forever(or until the room is pruned)
        messages        : game.messages     // load the message responders
    });

    cloak.on('init', function (room) {
        opentok.get_session_id(room.name, function (err, session_id) {
            room.session_id = session_id;
            _.forEach(room.members, function (m) { begin_member_session(m, room.session_id) });
        });
    });

    cloak.on('newMember', function (room, user) {
        if (room.session_id) {
            begin_member_session(user, room.session_id);
        }
    });

    var begin_member_session = function (user, session_id) {
        var token = opentok.get_token(session_id, user.id);
        user.message('begin_session', { session_id: session_id, token: token });
    }
});