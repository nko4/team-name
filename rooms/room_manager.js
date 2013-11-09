var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var User = require('./user');
var Room = require('./room');

function RoomManager (io, name) {
    this.rooms = [];
    this.name = name;
    this.max_room_size = 7;
    this.io = io;
    var that = this;

    io.sockets.on('connection', function (socket) {
        socket.on('join', function () {
            that.on_user_joined(new User(socket));
        });

        socket.on('disconnect', function () {
            that.on_user_left(new User(socket));
        });
    });
}

util.inherits(RoomManager, EventEmitter);

RoomManager.prototype.get_user_room = function (user) {
    var result = _.find(this.rooms, function (r) { return r.has_player(user); });
    console.log(result ? 'existing room found' : 'existing room not found');
    return result;
};

RoomManager.prototype.on_user_joined = function (user) {
    var room = this.get_user_room(user);

    if (!room) {
        room = this.find_open_room();
        room.add_player(user);
    }

    return room;
};

RoomManager.prototype.find_open_room = function () {
    var room = _.find(this.rooms, function (r) { return r.has_space(); });
    console.log(room ? 'open room found' : 'open room not found');

    if (!room) {
        room = new Room(this.max_room_size, 'Room ' + this.rooms.length);
        this.rooms.push(room);
        this.emit('game_created', room);
    }

    return room;
};

RoomManager.prototype.on_user_left = function (user) {
    var room = this.get_user_room(user);

    if (room) {
        room.remove_player(user);
    }
};

module.exports = RoomManager;