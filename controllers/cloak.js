var cloak = require('cloak');
var eventemitter = require('events').EventEmitter;
var util = require('util');
/**
 *  CloakServer is a wrapper around cloak server for our use
 *  example use:
 *  var CloakServer = require('./cloakserver.js');
 *  var cs = new CloakServer({
 *      <insert a valid cloak server config, see https://github.com/incompl/cloak/wiki/ServerConfiguration
 *  })
**/
module.exports = (function() {

    CloakServer.name = 'CloakServer';

    function CloakServer (options) {
        this.options = options || { port: 8080 };
        var that = this;
        this.options.room = {
            init        : function () { that.emit.apply(that, ['init', this].concat(Array.prototype.slice.call(arguments, 0))); },
            close       : function () { that.emit.apply(that, ['close', this].concat(Array.prototype.slice.call(arguments, 0))); },
            newMember   : function () { that.emit.apply(that, ['newMember', this].concat(Array.prototype.slice.call(arguments, 0))); },
            memberLeaves: function () { that.emit.apply(that, ['memberLeaves', this].concat(Array.prototype.slice.call(arguments, 0))); }
        };

        this.options.lobby = {
            init: function () {
                console.log('lobby init', arguments);
            },
            newMember: function () {
                console.log('new lobby memeber', arguments);
            },
            memberLeaves: function () {
                console.log('lobby member left', arguments);
            }
        };

        cloak.configure(this.options);
        this.run();
    }

    util.inherits(CloakServer, eventemitter);

    CloakServer.prototype.run = function(){
        cloak.run();
    };

    return CloakServer;

})();