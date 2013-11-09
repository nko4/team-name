function User (socket, name) {
    this.id = socket.id;
    this.score = 0;
    this.name = name || socket.id.substring(0, 10);
    this.get_socket = function () {
    	return socket;
    };
};

User.prototype.emit = function (event, args) {
    this.get_socket().emit(event, args);
};

User.prototype.on = function (event, cb) {
	this.get_socket().on(event, cb);
};

User.prototype.off = function (event) {
	this.get_socket().removeAllListeners(event);
};

module.exports = User;