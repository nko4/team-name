define([
  'chaplin',
  'views/base/collection-view',
  'views/queue-mini-view',
  'text!templates/queueCollection.hbs'
], function(Chaplin, CollectionView, QueueMini, queueCollectionTemplate){
  'use strict';

  var collectionView = CollectionView.extend({
    itemView      : QueueMini,
    template      : queueCollectionTemplate,
    listSelector  : '.actors'
  });

  collectionView.prototype.initItemView = function(model){
    return new this.itemView({
      model           : model,
      collectionView  : this,
      session         : this.options.session,
      api_key         : this.options.api_key
    });
  };

  return collectionView;
});