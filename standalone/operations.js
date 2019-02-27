process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
const mongoose = require('../middlewares/mongoose');
var Student = require('../models/student');
const pug = require('pug');
const emailTransporter = require('../controllers/email').sendPromise;

Student.find({}, (err, students) => {
    students.forEach((student) => {
        if (student.pictured == true){
            student.editable = false;
            student.save();
            console.log('Updated student: ' + student.email);
        }
    })
}) 
// fields = {
//     title: '[ACTION REQUIRED] Add Your Yearbook Entry',
//     preheader: "It's not too late to be included in the yearbook as a text entry! You have until Wednesday night to confirm your entry in order to be included in the yearbook.",
//     superheader: 'Hey Johnny,',
//     header: "Looks like we missed you this year...",
//     paragraph: "You are receiving this email because you didn't take a senior portrait for Technique 2019. However, you still can be included in the yearbook as a text entry. Simply log into the student portal below and confirm your name spelling, major/minor information, and quote. You have until Wednesday, February 27th at 11:59pm to confirm your text entry using the link below. Please do not forward this email to others, because anyone with the link below will be able to change your entry.",
//     records: {},
//     buttonLink: 'http://tnqportal.mit.edu/authkey/',
//     buttonText: 'Visit the Technique Student Portal'
// };
// html = pug.renderFile('./views/emailtemplate.pug', fields);
// var message = {
//     from: 'Technique <technique@mit.edu>',
//     to: 'jbui@mit.edu',
//     subject: '[ACTION REQUIRED] Add Your Yearbook Entry',
//     html
// };
// emailTransporter(message);