// Command line handling
const program = require('commander');
const readline = require('readline');

program
    .version('1.0.0');

program
    .command('encrypt <string>')
    .description('Encrypt the given string using the environment variable tnqportalkey')
    .action((string) => {
        const cryptr = require('../middlewares/cryptr');
        console.log(cryptr.encrypt(string));
    });


program
    .command('decrypt <string>')
    .description('Decrypt the given string using the environment variable tnqportalkey')
    .action((string) => {
        const cryptr = require('../middlewares/cryptr');
        console.log(cryptr.decrypt(string));
    });

program
    .command('import <path>')
    .description('Import students from a csv file at the given path')
    .action((path) => {
        return importcsv(path);
    });

program
    .command('email')
    .option('--production', 'send the emails through the live Mailgun instance')
    .description('Send emails to students who have not confirmed')
    .action((options) => {
        if (options.production) {
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
    });

program.parse(process.argv);


// Helper functions
function sendEmails(dryRun) {
    const emailTransporter = require('../controllers/email').sendPromise;
    const pug = require('pug');
    const mongoose = require('../middlewares/mongoose');
    const Student = require('../models/student');

    if (dryRun) {
        console.log('This is a dry run, and no emails will be sent.')
    } else {
        console.log('This is a production run of the email function.')
    }

    Student.find((err, students) => {
        if (err) {
            console.log(err);
        }
        counter = students.length; // initialize decrementing counter to track # of callbacks after each student iteration
        students.forEach(student => {
            if (dryRun && !student.confirmed) {
                console.log(student.email);
                counter = counter - 1;
            } else if (!student.confirmed) {
                // Send email
                fields = {
                    title: '[ACTION REQUIRED] Confirm Your Yearbook Entry',
                    preheader: "It's time to confirm your Technique 2019 yearbook entry.",
                    superheader: 'Hey ' + student.fname + ',',
                    header: "There's just one more step...",
                    paragraph: "Thank you for taking your senior portrait! Now, it's time to enter your senior quote information and confirm your yearbook entry for Technique 2019. You can log in and confirm your biogrpahical information in less than 60 seconds through the student portal. If you do not confirm by the deadline of 02/01, then Technique will not be responsible for any inaccuracies in your senior bio. Happy holidays from MIT Technique!",
                    records: {},
                    buttonLink: 'http://tnqportal.mit.edu',
                    buttonText: 'Visit the Technique Student Portal'
                };
                html = pug.renderFile('./views/emailtemplate.pug', fields);
                var message = {
                    from: 'MIT Technique <technique@mit.edu>',
                    to: student.email,
                    subject: '[ACTION REQUIRED] Confirm Your Yearbook Entry',
                    html
                };
                emailTransporter(message).then(() => {
                    counter = counter - 1;
                });
            } else {
                counter = counter - 1;
            }

            if (counter == 0) {
                process.exit();
            }

        })
    })
};

function importcsv(path) {
    const mongoose = require('../middlewares/mongoose');
    var Student = require('../models/student');

    // load csv
    const fs = require('fs');
    const csv = require('csv-parser');

    fs.createReadStream(path)
        .pipe(csv())
        .on('data', function (data) {
            try {
                Student.create({
                    fname: data.First,
                    lname: data.Last,
                    nameAsAppears: data.First + ' ' + data.Last,
                    email: data.Email,
                    major: '',
                    major2: '',
                    minor: '',
                    quote: ''
                });
            } catch (err) {
                console.log(err.message)
            }
        })
        .on('end', function () {
            console.log('Import complete.')
        });
}