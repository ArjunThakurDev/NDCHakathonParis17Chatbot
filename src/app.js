const builder = require('botbuilder');
const express = require('express');
const calling = require('botbuilder-calling');
const apiairecognizer = require('api-ai-recognizer');
const server = express();
var request = require("request");

const {
    RetrieveUserProfile
} = require('botbuilder-facebookextension');

server.use(express.static('public'));
server.set('port', (process.env.PORT || process.env.port || 3245));
server.listen(server.get('port'), () => {
    console.log('%s listening to %s', server.name, server.get('port'));
});

const CALLBACK_URL = process.env.CALLBACK_URL || 'https://luisbotsas.azurewebsites.net/api/calls';
const MICROSOFT_APP_ID = process.env.MICROSOFT_APP_ID || 'e4dcbef8-3545-4e8f-b4c8-aa2011cb671a';
const API_AI_TOKEN = process.env.API_AI_TOKEN || 'api_ai';
const MICROSOFT_APP_PASSWORD = process.env.MICROSOFT_APP_PASSWORD || 'avBBCTHdoztAxVU1Q7nojrS';
const LUIS_ENDPOINT = process.env.LUIS_ENDPOINT || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8ddf86d6-38e8-4a6e-ae1b-4ba46f8c92db?subscription-key=afe1452558cb446e96dac551c3c40a64&spellCheck=true&verbose=true&timezoneOffset=0';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAAEr8UfxbisBAJZCvIRuFbyjfvZAPSVewm8nat6ZBf3gYVgPKWOxtONnWKsDUGxRpugCVkWSbdobDycE7eZBZA1ZCWPqG6FUPZBiUTZAy8pFixNnqZCldQRtK0jDLhP6ZB9P1hUSOs7F6Nv0ZB2mEEctHXi00XqQQqQGr8F2ZCayvwnjoQZDZD';

/*
For Local console testing
*/
/*
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
*/

/*
For Text messages
*/

var connector = new builder.ChatConnector({
    appId: MICROSOFT_APP_ID,
    appPassword: MICROSOFT_APP_PASSWORD
});


server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

/*
For Calls
*/
var call_connector = new calling.CallConnector({
    callbackUrl: CALLBACK_URL,
    appId: MICROSOFT_APP_ID,
    appPassword: MICROSOFT_APP_PASSWORD
});
server.post('/api/calls', call_connector.listen());
var bot_call = new calling.UniversalCallBot(call_connector);





// send simple notification
function sendProactiveMessage(req) {
    // let id = req.query.id;
    console.log("Eneterd Method SPM");
    var sentadress = {
        "id": "mid.$cAABu47xXOMdlw2zNwVfkieFTqkbi",
        "channelId": "facebook",
        "user": {
            "id": "1477066145722451",
            "name": "Akash Vats"
        },
        "conversation": {
            "isGroup": false,
            "id": "1477066145722451-121923675157396"
        },
        "bot": {
            "id": "121923675157396",
            "name": "LUISbotSAS"
        },
        "serviceUrl": "https://facebook.botframework.com"
    }
    var msg = new builder.Message().address(sentadress);

    console.log(JSON.stringify(msg));

    msg.text('Your Meeting is at 17:30 PM');
    msg.textLocale('en-US');
    bot.send(msg);
}


// Do GET this endpoint to delivey a notification
server.get('/api/pushMessage', (req, res, next) => {
    sendProactiveMessage(req);
    var pushResponse = { "response": "Push triggered" };
    res.send(pushResponse);
    next();
});




bot_call.set('storage', new builder.MemoryBotStorage());

bot.use(
    RetrieveUserProfile({
        accessToken: FB_ACCESS_TOKEN,
        expireMinutes: 60,
        fields: ['first_name', 'last_name', 'gender']
    })
);

// var intents = new builder.IntentDialog({
//     recognizers: [recognizer = new builder.LuisRecognizer(LUIS_ENDPOINT)]
// });

var recognizer = new builder.LuisRecognizer(LUIS_ENDPOINT);
bot.recognizer(new builder.LuisRecognizer(LUIS_ENDPOINT));
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

console.log(JSON.stringify(intents));

var calling_intents = new builder.IntentDialog({
    recognizers: [recognizer = new builder.LuisRecognizer(LUIS_ENDPOINT)]
});

require('../fulfillment/intents')(intents);
require('../fulfillment/voice')(bot, bot_call, builder, calling);
bot.dialog('/', intents);



intents.onDefault((session, args) => {
    savedAddress = session.message.address;
    session.send("This is my bot");

    var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
    if (fulfillment) {
        var speech = fulfillment.entity;
        console.log(`Address of the user is ${JSON.stringify(session.message)}`);
        session.send(speech);
    } else {
        session.send('Sorry...not sure how to respond to that');
    }
});