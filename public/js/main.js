window.game = { session: null, publisher: null };

(function (game) {
    var log = function (message) {
        console.log(message);
    };

    $(document).ready(function () {
        start();
    });

    function subscribe_to_streams(streams) {
        if (!game.session)
            return;

        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            if (stream.connection.connectionId != game.session.connection.connectionId) {
                game.session.subscribe(stream, get_element_id_for_stream(stream));
            }
        }
    }

    function on_session_connected (event) {
        game.session.publish(game.publisher);
        subscribe_to_streams(event.streams);
    }

    function on_stream_created(event) {
        subscribe_to_streams(event.streams);
    }

    var get_element_id_for_stream = function (stream) {
        log('get_element_id_for_stream');
        var id = stream.connection.connectionId;
        $('body').append($('<div id="' + id +'"></div>'));
        return id;
    };

    var start = function () {
        join_room();
        end();
    };

    var end = function () {
        game.session.removeEventListener('sessionConnected');
        game.session.removeEventListener('streamCreated');
        game.session.disconnect();
        game = {};
    };

    var join_room = function (room_id) {
        var api_key = "44393472";
        var session_id = room_id || "1_MX40NDM5MzQ3Mn5-RnJpIE5vdiAwOCAxODoyMzo1MyBQU1QgMjAxM34wLjU2OTE2NzF-";
        var token = "T1==cGFydG5lcl9pZD00NDM5MzQ3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz00MDYzNzFjMTM4NDY1MmJmYWRmOTVlZmNkOWVlZTk3YTc2ZDQzNzk1OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRNNU16UTNNbjUtUm5KcElFNXZkaUF3T0NBeE9Eb3lNem8xTXlCUVUxUWdNakF4TTM0d0xqVTJPVEUyTnpGLSZjcmVhdGVfdGltZT0xMzgzOTYzODU5Jm5vbmNlPTAuMjI5NDU1MzkxNTM0NTUxMiZleHBpcmVfdGltZT0xMzg0MDUwMjU5JmNvbm5lY3Rpb25fZGF0YT0=";

        game.publisher = TB.initPublisher(api_key);
        game.session = TB.initSession(session_id);
        game.session.connect(api_key, token);
        game.session.on("sessionConnected",on_session_connected);
        game.session.on("streamCreated", on_stream_created);
    };
})(window.game);

