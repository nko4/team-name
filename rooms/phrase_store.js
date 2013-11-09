var phrases = require('../data/phrases');

function PhraseStore () { };

PhraseStore.prototype.get_phrase = function (history) {
	return phrases[Math.round(Math.random() * phrases.length)];
};

module.exports = PhraseStore;
