var all_phrases = require('../data/phrases');
var _ = require('underscore');
var config = require('../config');

function PhraseStore () {
    this.phrases = all_phrases.slice(0);
};

PhraseStore.prototype.get = function () {
    if (this.phrases.length == 0) {
        this.phrases = all_phrases.slice(0);
    }

    var i = Math.floor(Math.random() * this.phrases.length);
    var p = this.phrases.splice(i, 1);
	return _.extend({ hint: generate_hint(p[0].phrase) }, p[0]);
};

var generate_hint = function (val, percent) {
	 percent = percent || config.WORD_HINT_PERCENT;

    var replace_at = function (s, index, character) {
        return s.substr(0, index) + character + s.substr(index + character.length);
    };

    var get_random = function (max) {
        return Math.floor(Math.random() * max);
    };

    var replaced = _(val.split(/\s+/)).map(function (p) {
        var replace_random = function (s) {
            var char_replaced = "_";
            do {
                var i = get_random(s.length);
            } while (s[i] == "_");

            var result = replace_at(s, i, "_");
            return result;
        };

        var replacement_count = p.length - Math.floor(percent * p.length);

        for (var i = 0; i < replacement_count; i++) {
            p = replace_random(p);
        }
        
        return p;
    });

    return replaced.join(" ");
};

module.exports = PhraseStore;
