var opentok = require('../opentok');
var _ = require('underscore');
var PhraseStore = require('./phrase_store');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var config = require('../config');

var are_same = function (player1, player2) {
    if (!player1 && !player2)
        return true;

    if (player1 && player2) 
        return player1.id == player2.id;

    return false;
};

var log = function (message) {
    console.log(message);
};

var normalize_string = function (val) {
    return (val || "").replace(/\W+/gi, '');
};

function Game (max_size, name) {
    this.name = name;
    this.max_size = max_size;
    this.players = [];
    this.stage = { player: null, time: null };
    this.current_phrase = null;
    this.is_started = true;
    this.queue = [];
    this.private = false;
    this.phrase_store = new PhraseStore();
}

util.inherits(Game, EventEmitter);

Game.prototype.empty = function () {
    return this.players.length == 0;
};

Game.prototype.destroy = function () {
    this.end();
};

Game.prototype.has_space = function () {
    return this.players.length <= this.max_size;;
};

Game.prototype.add_player = function (player) {
    if (this.has_player(player)) 
        return;
    
    player.score = 0;

    var game = this;

    this.players.push(player);

    player.on('guess', (function (guess) {
        if (!this.stage.player) return;

        if (!this.current_phrase || are_same(this.stage.player, player))
            return;

        if (!this.check_guess(guess)) {
            this.message_players('bad_guess', { player: player, guess: guess });
        }
        else {
            this.stage.player.score += this.current_phrase.value * config().STAGE_PLAYER_SCORE_MOD; 
            player.score += this.current_phrase.value;
            this.message_players('correct_guess', { player: player, guess: guess, stage: this.stage.player }); 

            if (this.stage.player.score >= config().WINNING_SCORE) {
                this.winner(this.stage.player);
            }
            else if (player.score >= config().WINNING_SCORE) {
                this.winner(player);
            }
            else {
                this.complete_phrase();    
            }
        }
    }).bind(this));

    player.on('info', function (cb) {
        var info = game.info();
        cb(_.extend({ player_id: player.id }, info));
    });

    player.on('leave_stage', function () {
        if (this.stage.player && this.stage.player.id == socket.id) {
            game.leave_stage();
        }
    });

    player.on('enqueue', function () {
        game.enqueue_player(player);
    });

    player.on('dequeue', function () {
        game.dequeue_player(player);
    });

    this.emit('player_joined', player);

    this.message_players('players', this.players);

    if (this.players.length == 2) {
        this.start();
    }
};

Game.prototype.remove_player = function (player) {
    if (!this.has_player(player)) return;

    var is_on_stage = are_same(this.stage.player, player);

    if (is_on_stage) {
        this.clear_stage();
    }

    player.off('guess');
    player.off('info');
    player.off('guess');
    player.off('leave_stage');
    player.off('enqueue');
    player.off('dequeue');

    this.dequeue_player(player);    
    this.players = _(this.players).reject(function (e) { return e.id == player.id; });
    this.message_players('players', this.players);

    if (this.players.length < 2) {
        this.end();
    }
};

Game.prototype.enqueue_player = function (player) {
    if (!this.is_player_in_queue(player.id)) {
        this.queue.push(player);
        this.message_players('queue_updated', this.queue);
        return true;
    }
    return false;
};

Game.prototype.dequeue_player = function (player) {
    if (this.is_player_in_queue(player.id)) {
        this.queue = _(this.queue).reject(function (e) { return e.id == player.id; });
        this.message_players('queue_updated', this.queue);
        return true;
    }
    return false;
};

Game.prototype.is_player_in_queue = function (id) {
    return !!_.findWhere(this.queue, { id: id });
};

Game.prototype.remove_player_with_id = function (id) {
    var player = _.find(this.players, function (p) { return p.id == id});
    this.remove_player(player);
};

Game.prototype.check_guess = function (guess) {
    if (!this.current_phrase) 
        return false;
    return (normalize_string(guess) === this.current_phrase.normalized);
};

Game.prototype.message_players = function (message, data, extra) {
    this.players.forEach(function (p) {
        var new_data = _.clone(data || {});
        new_data.player_id = p.id;
        
        if (!!extra) {
            new_data = extra(p, new_data);
        }

        p.emit(message, new_data);
    });
};

Game.prototype.next_phrase = function () {
    clearTimeout(this.phrase_timeout);
    var p = this.phrase_store.get();
    var game = this;
    var parts = p.phrase.toLowerCase().split(/\s+/);
    
    this.current_phrase = {
        //these are private
        parts: parts,
        normalized: normalize_string(p.phrase),
        phrase: p,
        //these are public
        set_on: new Date().getTime(),
        hint: p.hint,
        value: p.value,
        duration: config().PHRASE_DURATION
    };
    
    var decorate_stage_player = function (player, o) {
        if (are_same(player, game.stage.player)) {
            o = _.clone(o);
            o.phrase = p.phrase;
        }
        return o;
    };
    
    this.message_players('new_phrase', this.guess_phrase_info(), decorate_stage_player);

    this.phrase_timeout = setTimeout((function () {
        this.complete_phrase();
    }).bind(this),  this.current_phrase.duration);
};

Game.prototype.guess_phrase_info = function () {
    if (this.current_phrase) {
        return {
            value: this.current_phrase.value,
            duration: this.current_phrase.duration,
            time_left: this.phrase_time_left(),
            hint: this.current_phrase.hint
        }
    }

    return {};
};

Game.prototype.set_stage = function (p) {
    if (are_same(this.stage.player, p)) return;
    this.stage.completed_phrases = 0;
    this.stage.player = p;
    this.message_players('stage_change', this.stage);
    this.next_phrase();                    
};

Game.prototype.complete_phrase = function () {
    this.stage.completed_phrases++;
    this.current_phrase = null;
    this.message_players('phrase_complete', this.players);
    
    // Start the next phrase if the stage didn't change
    if (!this.update_queue()) {
        this.next_phrase();
    }
};

Game.prototype.clear_stage = function () {
    clearInterval(this.phrase_timeout);
    this.stage.completed_phrases = 0;
    this.current_phrase = null;
    var p = this.stage.player;
    this.stage.player = null;
    this.message_players('stage_clear', p);
};

Game.prototype.start = function () {
    clearInterval(this.queue_handle);
    this.is_started = true;

    this.queue_handle = setInterval((function () {
        this.update_queue();
    }).bind(this), config().CHECK_QUEUE_INTERVAL);

    this.message_players('start', this.players);
    this.emit('start');
};

Game.prototype.winner = function (winner) {
    this.message_players("winner", winner);
    this.end();
};

Game.prototype.end = function () {
    clearInterval(this.queue_handle);
    clearTimeout(this.phrase_timeout);

    this.is_started = false;
    this.clear_stage();
    this.queue = [];
    this.current_phrase = null;
    this.message_players('end', this.players);
    this.emit('end');
};

Game.prototype.update_queue = function () {
    if (!this.is_started || this.queue.length == 0)
        return false;

    // If there's nobody on stage OR the player has been on stage long enough
    if (!this.stage.player || this.stage.completed_phrases >= config().PHRASE_LIMIT) {
        // If we are not in the middle of a phrase
        if (this.phrase_time_left() < config().CHECK_QUEUE_INTERVAL) {
            this.clear_stage();
            this.set_stage(this.queue.shift());
            this.message_players('queue_updated', this.queue);
            return true;
        }
    }

    return false;
};

Game.prototype.phrase_time_left = function () {
    if (!this.current_phrase) return 0;
    return this.current_phrase.duration - (new Date().getTime() - this.current_phrase.set_on);
};

Game.prototype.has_player = function (p) {
    if (!p) return false;
    return !!this.has_player_with_id(p.id);
};

Game.prototype.has_player_with_id = function (id) {
    if (!id) return false;
    return !!_.chain(this.players).pluck('id').contains(id).value();
};

Game.prototype.set_session_id = function (session_id) {
    this.session_id = session_id;
    this.name = this.name || session_id;
    this.emit('session_joined');
};

Game.prototype.info = function () {
    return { 
        game_name: this.name,
        players: this.players, 
        queue: this.queue, 
        stage: this.stage, 
        is_started: this.is_started, 
        private: this.private,
        phrase: this.guess_phrase_info()
    };
};

module.exports = Game;