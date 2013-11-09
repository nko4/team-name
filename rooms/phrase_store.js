var phrases = require('../data/phrases');
var _ = require('underscore');

function PhraseStore () { };

PhraseStore.prototype.get_phrase = function (history) {
	var p = _.clone(phrases[Math.round(Math.random() * phrases.length)]);
	p.hint = generate_hint(p.phrase);
	return p;
};

var generate_hint = function (val, percent) {
	 percent = percent || 0.25;

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
