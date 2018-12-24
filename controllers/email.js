// Functions used to send emails

const nodemailer = require('nodemailer');

// require the app secret decryption middleware
const appSecret = require('../middlewares/cryptr').decryptAppSecret;

let transporter = nodemailer.createTransport({
    port: 587,
    host: 'outgoing.mit.edu',
    secure: false,
    pool: true,
    auth: {
        user: appSecret("emailUser"),
        pass: appSecret("emailPass")
    }
})

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
         console.log(error);
    }
 });



// var message = {
//     from: '"MIT Technique" technique@mit.edu',
//     to: 'jbui@mit.edu',
//     subject: 'test test',
//     text: 'this is a test',
//     html: 'this is a test'
// }

function send(message) {
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Email sent successfully');
        }
    })
}

module.exports = send;
