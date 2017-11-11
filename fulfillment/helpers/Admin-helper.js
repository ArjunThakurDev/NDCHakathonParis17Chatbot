var builder = require("botbuilder");
var request = require("request");

module.exports = [
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

        console.log("My Session: " + JSON.stringify(session.message.address));
        console.log("My USer Data: " + JSON.stringify(session.userData));
        console.log("Entities:" + JSON.stringify(args.entities));
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

            }


            else {
                if (!user) {
                    var address = session.message.address;
                    var msg = new builder.Message()
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .address(address)
                        .attachments(create_cards(body, session));
                    session.endDialog(msg);
                }
                else {
                    console.log("user is " + user);

                    for (var i = 0, len = body.length; i < len; i++) {
                        console.log("DB Users " + body[i].FirstName + body[i].LastName);
                        if (body[i].FirstName + body[i].LastName == user) {
                            useridlocal = body[i].UserID;
                        }
                    }
                    var endpointUrl;

                    console.log(' hello : http://ghbotapi.azurewebsites.net/sasusers/' + useridlocal);
                    var offer_option = {
                        method: 'GET',
                        url: 'http://ghbotapi.azurewebsites.net/sasusers/' + useridlocal,
                        headers: {
                            'content-type': 'application/json'
                        },
                        json: true
                    };
                    request(offer_option, function (error, response, body) {
                        if (error) {
                            console.log('Offeres are not saved....');
                        } else {
                            //create_cards(body, session);
                            var address = session.message.address;
                            var msg = new builder.Message()
                                .attachmentLayout(builder.AttachmentLayout.carousel)
                                .address(address)
                                .attachments(create_cards(body, session));
                            session.endDialog(msg);

                        }
                    });
                }
            }
        });
    }

]
function create_cards(body, session_to_use) {
    var crew = body;
    var cards = [];
    var url;
    for (i = 0; i < crew.length; i++) {
        if (crew[i].Role === "Admin") { continue; }
        var item = crew[i];
        var option = item.EmpId;

        var card = new builder.HeroCard(session_to_use)
            .title(body[i].FirstName + " " + body[i].LastName)
            .subtitle("Role : " + body[i].Role + "\n" + "Flight status : " + body[i].CompletionStatus)
            .images([
                builder.CardImage.create(session_to_use, body[i].ProfilePic),
            ])
            .buttons([builder.CardAction.imBack(session_to_use, 'you have selected hotel details for ' + body[i].UserID, 'hotel for ' + body[i].FirstName),
            builder.CardAction.imBack(session_to_use, 'you have selected flight details for ' + body[i].UserID, 'flight for ' + body[i].FirstName)])
        cards.push(card);
    }
    return cards;
}

function get_image_url(code) {
    if (code === 'DEL') {

        return 'https://www.whatsuplife.in/gurgaon/blog/wp-content/uploads/2015/11/The-Leela-Ambience-Gurgaon-Hotel-Residences-Gurgaon-02.jpg';
    }
    if (code === 'CHE') {

        return 'https://luisbotstorage.blob.core.windows.net/botcontainer/gateway.jpg';
    }
    if (code === 'MUM') {

        return 'https://luisbotstorage.blob.core.windows.net/botcontainer/Leelamum.jpg'
    }
}

function get_txt(code) {
    if (code === 'MEL') {

        return 'Amazing meals';
    }
    if (code === 'CON') {

        return 'Fast connection anywhere';
    }
    if (code === 'BAG') {

        return 'Extra luggage allowance';
    }
    if (code === 'SET') {

        return 'Extra comfort';
    }
}

function get_titles(code) {
    if (code === 'MEL') {

        return 'Meals';
    }
    if (code === 'CON') {

        return 'Wifi';
    }
    if (code === 'BAG') {

        return 'Luggage';
    }
    if (code === 'SET') {

        return 'Seat';
    }
}



function get_txt(code) {
    if (code === 'MEL') {

        return 'Amazing meals';
    }
    if (code === 'CON') {

        return 'Fast connection anywhere';
    }
    if (code === 'BAG') {

        return 'Extra luggage allowance';
    }
    if (code === 'SET') {

        return 'Extra comfort';
    }
}