define(function(){
  'use strict';

  return function(match){
    match('', 'home#intro');
    match('/', 'home#intro');
    match('game/wait', 'game#wait');
    match('game/:session_id', 'game#play');
    match('/game/:session_id', 'game#play');
  }
});