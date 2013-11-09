window.game = { session: null, publisher: null, player_count: 0 };

(function (game) {
    var log = function () {
        var now = new Date();
        now = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds();
        arguments = [now].concat(Array.prototype.slice.call(arguments, 0));
        console.log.apply(console, arguments);
    };

    var socket = game.socket = io.connect('/');

    socket.emit('join');

    socket.on('session', function (data) {
        console.log('session created');
        join_room(data.session_id, data.token);
    });

    function subscribe_to_streams(streams) {
        if (!game.session)
            return;

        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            if (stream.connection.connectionId != game.session.connection.connectionId) {
                game.session.subscribe(stream, get_element_id_for_stream(stream));
                log('subscribing to stream ', stream);
            }
        }
    }

    function on_session_connected (event) {
        log('session created', event);
        game.session.publish(game.publisher);
        subscribe_to_streams(event.streams);
    }

    function on_stream_created(event) {
        log('stream created', event);
        subscribe_to_streams(event.streams);
    }

    var get_element_id_for_stream = function (stream) {
        return 'viewer_' + game.player_count;
    };

    var end = function () {
        game.session.off('sessionConnected');
        game.session.off('streamCreated');
        game.session.disconnect();
        game = {};
    };

    var join_room = function (session_id, token) {
        var api_key = "44393472";
        session_id = session_id || "1_MX40NDM5MzQ3Mn5-RnJpIE5vdiAwOCAxODoyMzo1MyBQU1QgMjAxM34wLjU2OTE2NzF-";
        token = token || "T1==cGFydG5lcl9pZD00NDM5MzQ3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz00MDYzNzFjMTM4NDY1MmJmYWRmOTVlZmNkOWVlZTk3YTc2ZDQzNzk1OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRNNU16UTNNbjUtUm5KcElFNXZkaUF3T0NBeE9Eb3lNem8xTXlCUVUxUWdNakF4TTM0d0xqVTJPVEUyTnpGLSZjcmVhdGVfdGltZT0xMzgzOTYzODU5Jm5vbmNlPTAuMjI5NDU1MzkxNTM0NTUxMiZleHBpcmVfdGltZT0xMzg0MDUwMjU5JmNvbm5lY3Rpb25fZGF0YT0=";

        log('Joining session ' + session_id);

        TB.setLogLevel(TB.NONE);
        game.publisher = TB.initPublisher(api_key, 'view_1');
        game.session = TB.initSession(session_id);
        game.session.connect(api_key, token);

        game.session.on("sessionConnected", on_session_connected);
        game.session.on("streamCreated", on_stream_created);
    };
})(window.game);

