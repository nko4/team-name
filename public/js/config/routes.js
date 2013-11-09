define(function(){
  'use strict';

  return function(match){
    match('', 'home#intro');
    match('/', 'home#intro');
    match('game/:id', 'game#play');
    match('/game/:id', 'game#play');
  }
});