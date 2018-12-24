// This file will dry run emailing all records in the user list that have not confirmed.
// In order to run as production (actually email users), you must run 'node email1.js --production' and confirm interatively.

// import email controller
const emailTransporter = require('../controllers/email');
const readline = require('readline');

const pug = require('pug');

if (process.argv[2] == '--production') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Are you sure you want to ACTUALLY send emails to users who have not confirmed? (y/N) ', (answer) => {
        if (answer.toLowerCase() == 'y') {
            sendEmails(false);
        } else {
            console.log('Emails were not sent. Terminating...')
            process.exit();
        }
        rl.close();
    });
} else {
    sendEmails(true);
}



function sendEmails(dryRun) {
    const mongoose = require('../middlewares/mongoose');
    const Student = require('../models/student');
    Student.find((err, students) => {
        if (err) {
            console.log(err);
        }
        students.forEach(student => {
            // Send email
            fields = {
                title: '[ACTION REQUIRED] Confirm Your Yearbook Entry',
                preheader: "It's time to confirm your Technique 2019 yearbook entry.",
                superheader: 'Hey ' + student.fname + ',',
                header: "There's just one more step...",
                paragraph: "Thank you for taking your senior portrait! Now, it's time to enter your senior quote information and confirm your yearbook entry for Technique 2019. You can log in to the student portal with the link below, and it should take less than 60 seconds. If you do not confirm by the deadline of 02/01, then Technique will not be responsible for any inaccuracies in your senior yearbook. Happy holidays from MIT Technique!",
                records: {},
                buttonLink: 'http://tnqportal.mit.edu',
                buttonText: 'Visit the Technique Student Portal'
            };
            html = pug.renderFile('./views/emailtemplate.pug', fields);
            var message = {
                from: '"MIT Technique" technique@mit.edu',
                to: student.email,
                subject: '[ACTION REQUIRED] Confirm Your Yearbook Entry',
                html
            };
            emailTransporter(message);
        })
    })
}