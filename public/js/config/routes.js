define(function(){
  'use strict';

  return function(match){
    match('', 'home#intro');
    match('/', 'home#intro');
    match('game/wait', 'game#wait');
    match('game/idle', 'game#idle');
    match('/game/idle', 'game#idle');
    match('game/:game_name', 'game#play');
    match('/game/:game_name', 'game#play');
  }
});