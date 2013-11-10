var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Player = require('./player');
var Game = require('./game');
var config = require('../config');

function GameManager (io, db) {
    this.games = [];
    this.io = io;
    this.db = db;

    io.sockets.on('connection', (function (socket) {
        var game = this;

        socket.on('join', function (data) {
            data = data || {};
            game.on_player_joined(new Player(socket, data.name), data.game_name);
        });

        socket.on('leave', function () {
            game.on_player_disconnect(socket.id);
        });

        socket.on('disconnect', function () {
            game.on_player_disconnect(socket.id);
        });

    }).bind(this));
}

util.inherits(GameManager, EventEmitter);

GameManager.prototype.find_game_by_player = function (p) {
    return _.find(this.games, function (r) { return r.has_player(p); });
};

GameManager.prototype.find_game_by_player_id = function (id) {
    return _.find(this.games, function (r) { return r.has_player_with_id(id); });
};

GameManager.prototype.get_named_game = function (name) {
    var game = _.find(this.games, function (g) { return g.name.toLowerCase() == name.toLowerCase(); });

    if (!game) {
        game = this.create_game(name, true);
    } 

    return game;
};

GameManager.prototype.get_public_game = function () {
    var game = _.find(this.games, function (r) { return !r.private && r.has_space(); });

    if (!game) {
        game = this.create_game('Game ' + this.games.length, false);
    }

    return game;
};

GameManager.prototype.create_game = function (name, private) {
    var game = new Game(config().MAX_GAME_SIZE, name, this.db);
    game.private = private;
    this.games.push(game);
    this.emit('game_created', game);
    return game;
};

GameManager.prototype.on_player_joined = function (p, game_name) {
    var game = this.find_game_by_player(p);
    
    // If the user is currently in a game
    // AND
    // The user has not specified a game name OR the game name is the same
    if (game && (!game_name || game_name.toLowerCase() == game.name.toLowerCase())) {
        return game;
    }

    // Found a game but we need to leave to join a different one because we specified a name
    if (game) {
        game.remove_player(p);
        game = null;
    }
    
    if (game_name) {
        game = this.get_named_game(game_name);
        
        if (game.has_space()) {
            game.add_player(p);    
        } else { //Too bad you gotta go to a random game.
            game = null;
        }
    }
    
    if (!game) {
        game = this.get_public_game();
        game.add_player(p);
    }

    return game;
};

GameManager.prototype.on_player_disconnect = function (id) {
    var game = this.find_game_by_player_id(id);

    if (game) {
        game.remove_player_with_id(id);
    
        if (game.empty()) {
           this.games.splice(this.games.indexOf(game), 1);
           game.destroy();
        }
    }   
};

module.exports = GameManager;