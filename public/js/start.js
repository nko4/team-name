require(['chaplin', 'config/routes', 'socketio'], function(Chaplin, routes, io){

  window.io = io;
  window.socket = io.connect()
  window.game = window.game || {};

  window.trackEvent = function(category, action, label, value) {
    if (!ga) return;
    ga('send', 'event', category, action, label, value);
  };

  // Wait for socket connection, then build the client side app
  socket.on('connect', function(){
    var app = Chaplin.Application.extend({
      title: 'Charades'
    });
    new app({ routes : routes, controllerSuffix : '-controller', root : '/' });
  });

  // Session events act as new games, navigate to the correct game
  socket.on('session', function (data) {
    window.game = data;
    Chaplin.helpers.redirectTo('game#play', { game_name: data.game_name });
  });

  // After going to sleep, some clients lose the socket connection.
  // Just refresh the page when this happens
  socket.on('disconnect', function(){
    location.reload();
  });
});