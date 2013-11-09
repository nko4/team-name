function User (socket) {
    this.socket = socket;
    this.id = socket.id;
};

User.prototype.emit = function (event, args) {
    this.socket.emit(event, args);
};

module.exports = User;