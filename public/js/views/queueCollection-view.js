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
    listSelector  : '.actors',
    events        : {
      'click .join-queue' : 'joinQueue',
      'click .leave-queue' : 'leaveQueue'
    }
  });

  collectionView.prototype.initItemView = function(model){
    return new this.itemView({
      model           : model,
      collectionView  : this,
      session         : this.options.session,
      api_key         : this.options.api_key
    });
  };

  collectionView.prototype.joinQueue = function(e) {
    $(e.currentTarget).hide();
    $(this.el).find('.leave-queue').removeClass('hidden').show();
    this.publishEvent('joinQueue');
  };

  collectionView.prototype.leaveQueue = function(e) {
    $(e.currentTarget).hide();
    $(this.el).find('.join-queue').show();
    this.publishEvent('leaveQueue');
  };

  return collectionView;
});