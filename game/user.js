function Player (socket) {
    this.id = socket.id;
    this.name = socket.id;
    this.score = 0;
    this.get_socket = function () {
    	return socket;
    };
};

Player.prototype.emit = function (event, args) {
    this.get_socket().emit(event, args);
};

Player.prototype.on = function (event, cb) {
	this.get_socket().on(event, cb);
};

Player.prototype.off = function (event) {
	this.get_socket().removeAllListeners(event);
};

module.exports = Player;