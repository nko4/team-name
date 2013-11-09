var cloak = require('cloak');
var _ = require('underscore');

module.exports = (function() {

    CloakServer.name = 'CloakServer';

    /**
     *  CloakServer is a wrapper around cloak server for our use
     *  example use:
     *  var CloakServer = require('./cloakserver.js');
     *  var cs = new CloakServer({
     *      <insert a valid cloak server config, see https://github.com/incompl/cloak/wiki/ServerConfiguration
     *  })
    **/
    function CloakServer (options) {
        this.options = options || { port: 8080 };
        this.options.room = {
            init: function () {
                console.log('new room created', arguments);
            },
            close: function () {
                console.log('roomm closed', arguments);
            },
            newMember: function () {
                console.log('new room memeber', arguments);
            },
            memberLeaves: function () {
                console.log('room member left', arguments);
            }
        };

        this.options.lobby = {
            init: function () {
                console.log('Lobby created');
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

    CloakServer.prototype.run = function(){
        cloak.run();
    };

    return CloakServer;

})();