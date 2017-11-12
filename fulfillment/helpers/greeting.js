var builder = require('botbuilder');
var request = require("request");

module.exports = [

    // Destination
    function (session, args, next) {
        var userrole;
        var userdetails = {
            "Get Flight details": {
                value: "show me my flight details",
            },
            "Get Hotel details": {
                value: "show me my hotel details",
            },
            "Get All User details": {
                value: "show all users details"
            }
        };

        var offer_option = {
            url: ' http://ghbotapi.azurewebsites.net/sasusers/',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
            json: true
        };
        request(offer_option, function (error, response, body) {
            if (error) {
                console.log('Unable to get data ');
                session.send(`We will get back to you with ancillary offers...`);
                throw new Error(error);

            } else {
                session.send('Welcome to TCS Aider help App');
                builder.Prompts.choice(session, "Please choose 1 of the given options", userdetails);
                next();
            }

        });
        /*         if (session.userData.first_name) {
        
                    builder.Prompts.text(session, `Hello ${session.userData.first_name}. :)`);
                } */
    },
    // Check-in
    function (session, results) {
        session.endDialog();
    },


];

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};