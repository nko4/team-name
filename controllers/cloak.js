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
        this.options.room = {
            init        : function () { this.emit('init', arguments); },
            close       : function () { this.emit('close', arguments); },
            newMember   : function () { this.emit('newMember', arguments); },
            memberLeaves: function () { this.emit('memberLeaves', arguments); },
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