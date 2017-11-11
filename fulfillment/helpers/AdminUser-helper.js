var builder = require("botbuilder");
var request = require("request");

module.exports = [
    (session, args, next) => {
        var entities = args.entities;
        var option_num = 0;
        var useridlocal;
        var empid = "null";
        var object = "null";
        var flighturl;
        var myaddon = "";
        for (var i = 0, len = entities.length; i < len; i++) {
            if (entities[i].type === 'builtin.number') {
                empid = entities[i].entity;
            }
            else if (entities[i].type === 'Object') {
                object = entities[i].entity;
            }
        }

        console.log("Entities :" + JSON.stringify(entities));

        if (object.includes("flight")) {

            myaddon = "flight";
        }
        else {
            myaddon = "hotel";
        }

        console.log("End point URL is ");
        console.log('http://ghbotapi.azurewebsites.net/sasusers/' + empid + '/' + myaddon + '/null/null/');

        var offer_option = {
            method: 'GET',
            url: 'http://ghbotapi.azurewebsites.net/sasusers/' + empid + '/' + myaddon + '/null/null/',
            headers: {
                'content-type': 'application/json'
            },
            json: true
        };
        request(offer_option, function (error, response, body) {
            if (error) {
                console.log('Offeres are not saved....');
            } else {

                var address = session.message.address;
                var msg = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .address(address)
                    .attachments(create_cards(body, session, myaddon));
                session.endDialog(msg);

            }
        });
    }

];

function create_cards(body, session_to_use, object) {
    var crew = body;
    var cards = [];
    for (i = 0; i < crew.length; i++) {

        var item = crew[i];
        var option = item.EmpId;
        if (object == "flight") {
            var card = new builder.HeroCard(session_to_use)
                .title(body[i].Origin + " To " + body[i].Destination)
                .subtitle("Flight: " + body[i].FlightNo + "Departing at : " + body[i].DepartureDate)
                .images([
                    builder.CardImage.create(session_to_use, body[i].flightpic)
                ])
                .buttons([builder.CardAction.imBack(session_to_use, 'Flight Details for ' + body[i].FlightNo)]);
            cards.push(card);

        }
        else {
            var card = new builder.HeroCard(session_to_use)
                .title(body[i].HotelName)
                .subtitle("Hotel Address : " + body[i].HotelAddress)
                .images([
                    builder.CardImage.create(session_to_use, get_image_url(body[i].City))
                ])
                .buttons([builder.CardAction.openUrl(session_to_use, "tel:" + body[i].ContactNum, "Call Hotel")]);
            cards.push(card);

        }

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