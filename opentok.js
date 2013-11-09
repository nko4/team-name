var OpenTok = require('opentok');
var key = process.env.TOKBOX_KEY;
var secret = process.env.TOKBOX_SECRET;
var opentok = new OpenTok.OpenTokSDK(key, secret);

module.exports = {
    get_session_id: function (key, cb) {
        opentok.createSession('127.0.0.1', function (result) {
            cb(null, result);
        });
    },
    get_token: function (session_id) {
        return opentok.generateToken({ session_id: session_id });
    }
};