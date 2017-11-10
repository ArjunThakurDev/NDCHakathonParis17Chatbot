var builder = require("botbuilder");
var request = require("request");

module.exports = [
    (session, args, next) => {
        var entities = args.entities;
        var option_num = 0;
        var useridlocal;
        var userdate = "null";
        var userloc = "null";
        var flighturl;
        for (var i = 0, len = entities.length; i < len; i++) {
            if (entities[i].type === 'builtin.datetimeV2.date') {
                userdate = entities[i].resolution.values[0].value;
            }
            else if (entities[i].type === 'Location') {
                userloc = entities[i].resolution.values[0];
            }
        }

        console.log("My Session: " + JSON.stringify(session.message.address));
        console.log("My USer Data: " + JSON.stringify(session.userData));

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
                console.log("Body:" + JSON.stringify(body));
                console.log("DB users +" + body[0].FirstName + body[0].LastName);
                console.log("Session users +" + session.userData.first_name + session.userData.last_name);

                for (var i = 0, len = body.length; i < len; i++) {
                    if (body[i].FirstName + body[i].LastName === session.userData.first_name + session.userData.last_name) {
                        useridlocal = body[i].UserID;
                    }
                }
                console.assert("user id is " + useridlocal);
                console.log('http://ghbotapi.azurewebsites.net/sasusers/' + useridlocal + '/hotel/' + userloc + '/' + userdate);
                var offer_option = {
                    method: 'GET',
                    url: 'http://ghbotapi.azurewebsites.net/sasusers/' + useridlocal + '/hotel/' + userloc + '/' + userdate,
                    headers: {
                        'content-type': 'application/json'
                    },
                    json: true
                };
                request(offer_option, function (error, response, body) {
                    if (error) {
                        console.log('Offeres are not saved....');
                    } else {
                        create_cards(body, session, userdate, userloc);
                        var address = session.message.address;
                        var msg = new builder.Message()
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .address(address)
                            .attachments(create_cards(body, session));
                        session.endDialog(msg);

                    }
                });
            }
        });
    }
];

function create_cards(body, session_to_use, date, location) {
    console.log(JSON.stringify(body));
    var crew = body;
    var cards = [];
    for (i = 0; i < crew.length; i++) {

        var item = crew[i];
        var option = item.EmpId;
        var card = new builder.HeroCard(session_to_use)
            .title(body[i].HotelName)
            .subtitle("Hotel Address : " + body[i].HotelAddress)
            .images([
                builder.CardImage.create(session_to_use, body[i].hotepic)
            ])
            .buttons([builder.CardAction.postBack(session_to_use, "tel:" + body[i].ContactNum, 'Call Hotel')]);
        cards.push(card);
    }
    console.log(cards);
    return cards;
}

function get_image_url(code) {
    if (code === 'MEL') {

        return 'http://www.cardatabase.net/modifiedairlinerphotos/photos/big/00014380.jpg';
    }
    if (code === 'CON') {

        return 'https://www.whatsuplife.in/gurgaon/blog/wp-content/uploads/2015/11/The-Leela-Ambience-Gurgaon-Hotel-Residences-Gurgaon-02.jpg';
    }
    if (code === 'BAG') {

        return 'https://dishccvmy41gl.cloudfront.net/spree/products/173/product_retina/Away_Large_Navy.jpg?1493120102https://s3-us-west-2.amazonaws.com/beachbody-blog/uploads/2016/05/mexican-meal-prep.jpg'
    }
    if (code === 'SET') {

        return 'https://i.pinimg.com/originals/c0/a6/09/c0a609801d296f340a04f0014bfc67fc.jpg';
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