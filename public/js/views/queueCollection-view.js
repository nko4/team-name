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
      'click .leave-queue': 'leaveQueue',
      'click .volunteer'  : 'joinQueue'
    },
    listen        : {
      'queue_updated mediator' : 'updateQueueAction',
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
    e.preventDefault();
    this.publishEvent('joinQueue');
  };

  collectionView.prototype.leaveQueue = function(e) {
    this.publishEvent('leaveQueue');
  };

  collectionView.prototype.updateQueueAction = function(queue) {
    var me  = _.findWhere(queue, { id : mySocketId });
    var $el = $(this.el);
    if(me) {
      $el.find('.leave-queue').removeClass('hidden');
      $el.find('.join-queue').addClass('hidden');
    } else {
      $el.find('.leave-queue').addClass('hidden');
      $el.find('.join-queue').removeClass('hidden');
    }

    if (queue.length == 0) {
      $el.find('.no-actors').removeClass('hidden');
    } else {
      $el.find('.no-actors').addClass('hidden');
    }
  };

  return collectionView;
});