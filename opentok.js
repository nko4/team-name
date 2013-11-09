var OpenTok = require('opentok');
var key = '';    // Replace with your API key
var secret = '';  // Replace with your API secret
var opentok = new OpenTok.OpenTokSDK(key, secret);

module.exports = {
    get_session_id: function (cb) {
        opentok.createSession("127.0.0.1", {'p2p.preference':'enabled'}, function (result) {
            cb(null, result);
        });
    },
    get_token: function(session_id, user_id) {
        return opentok.generateToken({session_id: session_id, 'role': "publisher", connection_data: 'user_id:' + user_id });
    }
};