var OpenTok = require('opentok');
var key = process.env.TOKBOX_KEY;    // Replace with your API key
var secret = process.env.TOKBOX_SECRET;  // Replace with your API secret
var opentok = new OpenTok.OpenTokSDK(key, secret);
var sessions = {};

module.exports = {
    get_session_id: function (key, cb) {
        if (sessions[key])
            return cb(null, sessions[key]);

        opentok.createSession("127.0.0.1", function (result) {
            sessions[key] = result;
            cb(null, result);
        });
    },
    get_token: function(session_id) {
        return opentok.generateToken({session_id: session_id, 'role': "publisher" });
    }
};