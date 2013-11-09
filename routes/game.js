
exports.messages = function () {
    return {
        chat: function(){
            console.log('incoming chat message', arguments);
        }
    };
};

exports.lobby = function (req, res) {
    res.send('game.js::lobby');
};

exports.play = function (req, res) {
    res.send('game.js::play');
};