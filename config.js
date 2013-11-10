var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

var base = {
	MONGO_DB_CONNECTION: process.env.PHRASE_MONGO_DB
};

var config = {
	WORD_HINT_PERCENT: .60,
	CHECK_QUEUE_INTERVAL: 300,
	PHRASE_DURATION: 45 * 1000,
	PHRASE_LIMIT: 3,
	MAX_GAME_SIZE: 7,
	STAGE_PLAYER_SCORE_MOD: 2,
	WINNING_SCORE: 20,
	TIME_BETWEEN_GAMES: 15 * 1000	
};

var current_config = _.extend({}, config, base);

MongoClient.connect(process.env.PHRASE_MONGO_DB, function (err, db) {
	if (err) return;
	
	get_config.reload = function () {
		var collection = db.collection('config');
		console.log('Reloading config');
		collection.findOne(function (err, result) {
			if (err || !result) return;
			current_config = _.extend({}, config, result, base);
			console.log('Config reloaded', current_config)
		});
	};
	
	get_config.reload();

	setInterval(get_config.reload, 10 * 60 * 1000); //10 minutes
});

var get_config = function () {
	return current_config;
};

get_config.reload = function () {};

module.exports = get_config;