const nodemailer = require('nodemailer');

// Start dotenv
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

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
    } else {
         console.log('SMTP settings verified.');
    }
 });



var message = {
    from: '"MIT Technique" technique@mit.edu',
    to: 'jbui@mit.edu',
    subject: 'test test',
    text: 'this is a test',
    html: 'this is a test'
}

transporter.sendMail(message, (err, info) => {
    if (err) {
        console.log(err.message)
        process.exit()
    } else {
        console.log('Email sent successfully')
        process.exit()
    }
})
