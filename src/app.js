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
const MICROSOFT_APP_ID = process.env.MICROSOFT_APP_ID || '8fff4c9b-acb4-46f5-8727-f01d908b952c';
const API_AI_TOKEN = process.env.API_AI_TOKEN || 'api_ai';
const MICROSOFT_APP_PASSWORD = process.env.MICROSOFT_APP_PASSWORD || '4yb1Mhemjc6Yz7M4z0Mvp9S';
const LUIS_ENDPOINT = process.env.LUIS_ENDPOINT || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d95339f5-4f1b-46c7-82ce-25c0a2cf8348?subscription-key=900921ac3fac4a9ebe6dd04f475ed898&verbose=true&timezoneOffset=0';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAABsIS7VNNYBAMgrZCdZBDvftYjdEIhZBURGO2mdZAzdj5cHWTx3Kmg22zGkuwNZCLaIctbZAOlKv5JP0dLOgY7WejlYC8E4GhpTYpfQMaT5s6mOuciqeCz21VL4TgOfosgVh2ZBm9n2fvzAGKbQQmbXaAfEWMYDz0VU0R2I8miqgZDZD';

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
        console.log('My Commit');
        var speech = fulfillment.entity;
        console.log(`Address of the user is ${JSON.stringify(session.message)}`);
        session.send(speech);
    } else {
        session.send('Sorry...not sure how to respond to that');
    }
});