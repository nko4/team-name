var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Player = require('./player');
var Game = require('./game');
var config = require('../config');

function GameManager (io) {
    this.games = [];
    this.io = io;

    io.sockets.on('connection', (function (socket) {
        var game = this;
        socket.on('join', function () {
            game.on_player_joined(new Player(socket));
        });
        socket.on('disconnect', function () {
            game.on_player_left(new Player(socket));
        });
    }).bind(this));
}

util.inherits(GameManager, EventEmitter);

GameManager.prototype.find_game = function (p) {
    return _.find(this.games, function (r) { return r.has_player(p); });
};

GameManager.prototype.on_player_joined = function (p) {
    var game = this.find_game(p);

    if (!game) {
        game = this.get_open_game();
        game.add_player(p);
    }

    return game;
};

GameManager.prototype.get_open_game = function () {
    var game = _.find(this.games, function (r) { return r.has_space(); });

    if (!game) {
        game = new Game(config.MAX_GAME_SIZE, 'Game ' + this.games.length);
        this.games.push(game);
        this.emit('game_created', game);
    }

    return game;
};

GameManager.prototype.on_player_left = function (p) {
    var game = this.find_game(p);

    if (game) {
        game.remove_player(p);
    
        if (game.empty()) {
           this.games.splice(this.games.indexOf(game), 1);
           game.destroy();
        }
    }   
};

module.exports = GameManager;