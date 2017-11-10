var builder = require("botbuilder");
var request = require("request");

module.exports = (city,phone,flight) => [
    (session, args, next) => {
        var entities = args.entities;
        var option_num = 0;
        var useridlocal;
        var user;
        var flighturl;
        for (var i = 0, len = entities.length; i < len; i++) {
            if (entities[i].type === 'Users') {
                user = entities[i].resolution.values[0];
            }
        }
    }
    ];