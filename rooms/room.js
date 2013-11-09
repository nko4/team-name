var opentok = require('../opentok');
var _ = require('underscore');

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

module.exports = Room;