var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure');
var FBProfile = require('botbuilder-facebookextension');
var documentDbOptions = {
    host: 'https://ndchakathonparis17db.documents.azure.com:443/',
    masterKey: '6hdn7dTNoxUPHXv0JBCsSkxGWWzX0YE6IrxDsonauR8tHZCHoHvC9ibUxo60Bcb2UNQg2zF0HhpR60Ri2g0Mvw==',
    database: 'botdocs',
    collection: 'botdata'
};

var usernameInt;
var UserNameKey = 'UserName';
var usernameSocial = 'FacebookID';

var docDbClient = new azure.DocumentDbClient(documentDbOptions);



var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);
var pageaAcessToken = "EAABsIS7VNNYBAM1nbo1ZBxm3UZBkG5F7CvL6mMDOVbUjLRl4ItOrZBGursNfAxtrntUObxZCCZBEKPzEGGltfMAIaxxX6il3txXloVzVuBNTk0kbcAokUY4KHxIO3DHWWQqHzYG13peIDhdce2g6rnvqg6czZAnKQ1KeZAFuiNjUgZDZD";
 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


var bot = new builder.UniversalBot(connector, function (session) {
    var userName = session.userData[UserNameKey];
    if (!userName) {
        return session.beginDialog('login');
    }
    session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
}).set('storage', cosmosStorage);
bot.set('persistConversationData', true);
bot.use(  
    FBProfile.RetrieveUserProfile({
        accessToken: pageaAcessToken,
        expireMinutes: 60, // OPTIONAL
        fields: ['first_name', 'last_name', 'gender','last_ad_referral'] // OPTIONAL
    })
);

//////////////////////////////////////////////////////////////////////////
bot.dialog('login', [function (session, args, next) {
    
    session.send(`Hi ${session.userData.first_name} ${session.userData.last_name}`);
    
    
},
function (session, results) {
    console.log("Emp ID" + results.response);
    session.userData[UserNameKey] = session.userData.first_name;
    builder.Prompts.text(session, "Thanks for loging %s", session.userData[UserNameKey]);
    builder.Prompts.text(session, "How you want to help us");
},
function (session, results) {
    console.log("Emp ID" + results.response);
    session.userData[UserNameKey] = results.response;
    session.endDialog("Thanks for loging %s", session.userData[UserNameKey]);
}
]).triggerAction({ matches: /^(login)/i });

//////////////////////////////////////////////////////////////////////////

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    session.conversationData[username] = "Seattle",
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Classic White T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'https://rukminim1.flixcart.com/image/832/832/j7qi9ow0/shirt/h/h/e/m-ms17f0-97-metronaut-original-imaexwg7nkryhkq9.jpeg?q=70')])
            .buttons([

                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'https://rukminim1.flixcart.com/image/312/312/shirt/g/e/d/hlsh008882-light-blue-highlander-s-original-imaejy6fp2zghrxe.jpeg?q=70')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });





