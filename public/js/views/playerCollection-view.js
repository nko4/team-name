define([
  'chaplin',
  'views/base/collection-view',
  'views/player-mini-view',
  'text!templates/playerCollection.hbs'
], function(Chaplin, CollectionView, PlayerMiniView, playerCollectionTemplate){
  'use strict';

  var collectionView = CollectionView.extend({
    itemView      : PlayerMiniView,
    className     : 'players-wrapper',
    template      : playerCollectionTemplate,
    listSelector  : '.players'
  });

  return collectionView;
});