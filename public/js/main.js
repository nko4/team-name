var apiKey = "44393472";
var sessionId = "1_MX40NDM5MzQ3Mn5-RnJpIE5vdiAwOCAxODoyMzo1MyBQU1QgMjAxM34wLjU2OTE2NzF-";
var token = "T1==cGFydG5lcl9pZD00NDM5MzQ3MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz00MDYzNzFjMTM4NDY1MmJmYWRmOTVlZmNkOWVlZTk3YTc2ZDQzNzk1OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRNNU16UTNNbjUtUm5KcElFNXZkaUF3T0NBeE9Eb3lNem8xTXlCUVUxUWdNakF4TTM0d0xqVTJPVEUyTnpGLSZjcmVhdGVfdGltZT0xMzgzOTYzODU5Jm5vbmNlPTAuMjI5NDU1MzkxNTM0NTUxMiZleHBpcmVfdGltZT0xMzg0MDUwMjU5JmNvbm5lY3Rpb25fZGF0YT0=";
var j = 0;
var myDivId = "me";

function sessionConnectedHandler (event) {
    session.publish(publisher);
    subscribeToStreams(event.streams);
}

function subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
        var stream = streams[i];

        if (stream.connection.connectionId != session.connection.connectionId) {
            console.log('subscribing')
            session.subscribe(stream, "test");
        }
    }
}

function streamCreatedHandler(event) {
    subscribeToStreams(event.streams);
}

var start = function () {
    get_room_id(function (err, room_id) {
        join_room(room_id);
    });
};

var end = function () {

};

var join_room = function (room_id) {
    var publisher = TB.initPublisher(apiKey, myDivId);
    var session   = TB.initSession(sessionId);

    session.connect(apiKey, token);
    session.on("sessionConnected",sessionConnectedHandler);
    session.on("streamCreated", streamCreatedHandler);
};