var mongoose = require('mongoose');
var crypto = require('crypto');

var StudentSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    nameAsAppears: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    major: {
        type: String
    }, 
    major2: {
        type: String
    },
    minor: {
        type: String
    },
    quote: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    authKey: {
        type: String,
        unique: true,
        default: crypto.randomBytes(32).toString('hex')
    }

});

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;