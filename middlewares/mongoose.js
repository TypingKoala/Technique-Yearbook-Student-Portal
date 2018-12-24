// require the app secret decryption middleware
const appSecret = require('./cryptr').decryptAppSecret;

// Configure mongoose and connect based on NODE_ENV
const mongoose = require('mongoose');
if (process.env.NODE_ENV === "production") {
    mongoaddr = appSecret('mongoProd');
} else {
    mongoaddr= appSecret('mongoDev');
}

mongoose.connect(mongoaddr, {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log(`MongoDB connection to ${mongoaddr} succeeded.`)
    }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;