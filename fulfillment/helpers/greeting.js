var builder = require('botbuilder');

module.exports = [

    // Destination
    function (session,args, next) {
        var userdetails = {
            "Get Flight details": {
                value: "show me my flight details",
            },
            "Get Hotel details": {
                value: "show me my hotel details",
            }
        };
/*         if (session.userData.first_name) {

            builder.Prompts.text(session, `Hello ${session.userData.first_name}. :)`);
        } */
        session.send('Welcome to TCS Aider help App');
        builder.Prompts.choice(session, "Please choose 1 of the given options", userdetails);
        next();
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