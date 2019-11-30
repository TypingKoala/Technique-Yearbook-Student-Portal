var mongoose = require('mongoose');
var crypto = require('crypto');

var StudentSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    nameAsAppears: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    major: {
        type: String,
        default: ""
    },
    major2: {
        type: String,
        default: ""
    },
    minor: {
        type: String,
        default: ""
    },
    hometown: {
        type: String,
        default: ""
    },
    quote: {
        type: String,
        default: ""
    },
    confirmed: {
        type: Boolean,
        default: false,
        required: true
    },
    authKey: {
        type: String,
        unique: true,
        required: true
    },
    pictured: {
        type: Boolean,
        default: false,
        required: true
    },
    editable: {
        type: Boolean,
        default: true,
        required: true
    }

});

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;