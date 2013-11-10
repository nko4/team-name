var _ = require('underscore');
var config = require('../config');
var mongodb = null;

function PhraseStore () {
    this.phrases = PhraseStore.all_phrases.slice(0);
};

PhraseStore.initialize = function (db, cb) {
    PhraseStore.load_data(db, function (err, results) {
        if (err) throw err;
        cb();
        
        var orig = PhraseStore.load_data;

        PhraseStore.load_data = function () {
            orig(db);
        };

        setInterval(function () {
            PhraseStore.load_data();
        }, 10 * 60 * 1000);
    });
};

PhraseStore.load_data = function (db, cb) {
    var collection = db.collection('phrases');
    collection.find().toArray(function (err, results) {
        if (err && !cb) {
            console.log('error loading phrases');
            return;
        }

        PhraseStore.all_phrases = results;
        console.log(results.length + ' Phrases loaded');
        
        if (cb) { cb(err, results); }
    });
};


PhraseStore.prototype.get = function () {
    if (this.phrases.length == 0) {
        this.phrases = PhraseStore.all_phrases.slice(0);
    }

    var i = Math.floor(Math.random() * this.phrases.length);
    var p = this.phrases.splice(i, 1);
	return _.extend({ hint: generate_hint(p[0].phrase) }, p[0]);
};

var generate_hint = function (val, percent) {
	 percent = percent || config().WORD_HINT_PERCENT;

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
