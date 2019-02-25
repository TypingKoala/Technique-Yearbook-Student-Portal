process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
const mongoose = require('../middlewares/mongoose');
var Student = require('../models/student');
const pug = require('pug');

// Student.find({}, (err, students) => {
//     students.forEach((student) => {
//         student.pictured = true;
//         student.save();
//         console.log('Updated student: ' + student.email);
//     })
// }) 
fields = {
    title: '[ACTION REQUIRED] Add Your Yearbook Entry',
    preheader: "Even though you didn't get a picture for the yearbook this year, we would love to include you as a text entry. You have until Wednesday night to confirm your entry in order to be included in the yearbook.",
    superheader: 'Hey ,',
    header: "Looks like we missed you this year...",
    paragraph: "You are receiving this email because you didn't take a picture for the yearbook this year. However, you still can be included in the yearbook as a text entry. Simply log into the student portal below and confirm your name spelling, major/minor information, and quote. You have until Wednesday, February 27th at 11:59pm to confirm your text entry using the link below. Please do not forward this email to others, because anyone with the link below will be able to change your entry.",
    records: {},
    buttonLink: 'http://tnqportal.mit.edu/authkey/',
    buttonText: 'Visit the Technique Student Portal'
};
html = pug.renderFile('./views/emailtemplate.pug', fields);
console.log(html);