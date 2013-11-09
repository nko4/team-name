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
        cloak.configure(this.options);
        this.run();
    }

    CloakServer.prototype.run = function(){
        cloak.run();
    };

    return CloakServer;

})();