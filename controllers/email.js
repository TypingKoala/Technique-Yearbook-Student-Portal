

// require the app secret decryption middleware
const appSecret = require('../middlewares/cryptr').decryptAppSecret;


var mailgun = require("mailgun-js");
var DOMAIN = 'mg.jbui.me'
var mailgun = require('mailgun-js')({apiKey: appSecret('mailgunAPIKey'), domain: DOMAIN});



// var message = {
//     from: 'MIT Technique <technique@mit.edu>',
//     to: 'jbui@mit.edu',
//     subject: 'test test',
//     html: 'this is a test'
// }

function send(message) {
    mailgun.messages().send(message, function (error, body) {
        if (error) {
            console.log(error);
        }
        console.log(body);
    });
}

function sendPromise(message) {
    return new Promise((resolve, reject) => {
        mailgun.messages().send(message, function (error, body) {
            if (error) return reject();
            console.log('Status for message to ' + message.to + ': ' + body.message);
            resolve();
        });
    })
}

module.exports.send = send;
module.exports.sendPromise = sendPromise;
