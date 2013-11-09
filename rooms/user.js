function User (socket) {
    this.id = socket.id;
    this.score = 0;
    this.get_socket = function () {
    	return socket;
    };
};

User.prototype.emit = function (event, args) {
    this.get_socket().emit(event, args);
};

module.exports = User;