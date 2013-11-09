var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var opentok = require('./opentok');

function User (socket) {
    this.socket = socket;
    this.id = socket.id;
};

User.prototype.emit = function (event, args) {
    this.socket.emit(event, args);
};

function Room (max_size, name) {
    this.name = name;
    this.max_size = max_size;
    this.members = [];

    console.log('Room created max:' + max_size + ' name: ' + name)
}

Room.prototype = {
    has_space: function () {
        var result =  this.members.length < this.max_size;
        console.log(this.name + ' has room: ' + result);
        return result;
    },
    add_member: function (user) {
        if (this.has_member(user)) return;
        this.members.push(user);

        if (this.session_id) {
            var token = opentok.get_token(this.session_id, user.id);
            user.emit('session', { session_id: this.session_id, token: token });
        }
    },
    remove_member: function (user) {
        this.members = _(this.members).reject(function (e) { return e.id == user.id; });
    },
    has_member: function (m) {
        var result = _.chain(this.members).pluck('id').contains(m.id).value();
        console.log('has member ' + result);
        return result;
    },
    set_session_id: function (session_id) {
        console.log('Set session id for room ' + this.name);
        this.session_id = session_id;
        _(this.members).each(function (m) {
            var token = opentok.get_token(session_id, m.id);
            m.emit('session', { session_id: session_id, token: token });
        });
    }
};

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

        socket.on('rooms', function () {
           socket.emit('rooms', that.rooms);
        });

        socket.on('disconnect', function () {
            that.on_user_left(new User(socket));
        });
    });
}

util.inherits(RoomManager, EventEmitter);

RoomManager.prototype.get_user_room = function (user) {
    var result = _.find(this.rooms, function (r) { return r.has_member(user); });
    console.log(result ? 'existing room found' : 'existing room not found');
    return result;
};

RoomManager.prototype.on_user_joined = function (user) {
    var room = this.get_user_room(user);

    if (!room) {
        room = this.find_open_room();
        room.add_member(user);
    }

    return room;
};

RoomManager.prototype.find_open_room = function () {
    var room = _.find(this.rooms, function (r) { return r.has_space(); });
    console.log(room ? 'open room found' : 'open room not found');

    if (!room) {
        room = new Room(this.max_room_size, 'Room ' + this.rooms.length);
        this.rooms.push(room);
        this.emit('room_created', room);
    }

    return room;
};

RoomManager.prototype.on_user_left = function (socket) {
    var id = get_user_id(socket);
    var room = this.get_user_room(id);
    if (room) {
        room.remove_member(id);
    }
};

function get_user_id (socket) {
    return socket.id;
};

module.exports = RoomManager;