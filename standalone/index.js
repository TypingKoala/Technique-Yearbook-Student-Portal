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
    .command('crosscheck <path>')
    .description('Given a CSV file, finds differences in the students')
    .action((path) => {
        return crosscheck(path);
    })

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
    process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
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
        emails = 0; // number of emails to send (aka non-confirmed students)
        students.forEach(student => {
            if (dryRun && !student.confirmed) {
                console.log(student.email);
                emails++;
                counter = counter - 1;
            } else if (!student.confirmed && !student.pictured) {
                // Send email
                fields = {
                    title: '[ACTION REQUIRED] Add Your Yearbook Entry',
                    preheader: "Even though you didn't get a picture for the yearbook this year, we would love to include you as a text entry. You have until Wednesday night to confirm your entry in order to be included in the yearbook.",
                    superheader: 'Hey ' + student.fname + ',',
                    header: "Looks like we missed you this year...",
                    paragraph: "You are receiving this email because you didn't take a picture for the yearbook this year. However, you still can be included in the yearbook as a text entry. Simply log into the student portal below and confirm your name spelling, major/minor information, and quote. You have until Wednesday, February 27th at 11:59pm to confirm your text entry using the link below. Please do not forward this email to others, because anyone with the link below will be able to change your entry.",
                    records: {},
                    buttonLink: 'http://tnqportal.mit.edu/authkey/' + student.authKey,
                    buttonText: 'Visit the Technique Student Portal'
                };
                html = pug.renderFile('./views/emailtemplate.pug', fields);
                var message = {
                    from: 'Technique <technique@mit.edu>',
                    to: student.email,
                    subject: '[ACTION REQUIRED] Add Your Yearbook Entry',
                    html
                };
                emailTransporter(message).then(() => {
                    counter = counter - 1;
                    if (counter == 0) {
                        console.log("Emails sent: " + emails.toString());
                        process.exit();
                    }
                });
                emails++;
            } else {
                counter = counter - 1;
            }
            if (counter == 0) {
                console.log("Emails sent: " + emails.toString());
                process.exit();
            }
            
        })
    })
};

function importcsv(path) {
    process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
    const mongoose = require('../middlewares/mongoose');
    var Student = require('../models/student');
    const crypto = require('crypto');


    // load csv
    const fs = require('fs');
    const csv = require('csv-parser');

    fs.createReadStream(path)
        .pipe(csv())
        .on('data', function (data) {
            try {
                Student.findOne({
                    email: data.EMAIL.toLowerCase()
                }, (err, student) => {
                    if (!student) {
                        Student.create({
                            fname: data.FIRSTNAME,
                            lname: data.LASTNAME,
                            nameAsAppears: data.FIRSTNAME + ' ' + data.LASTNAME,
                            email: data.EMAIL.toLowerCase(),
                            major: '',
                            major2: '',
                            minor: '',
                            quote: '',
                            pictured: false,
                            authKey: crypto.randomBytes(32).toString('hex')
                        });
                        console.log('Added student: ' + data.EMAIL)
                    // } else if (!student.confirmed) {
                    //     student.update({
                    //         fname: data.FIRSTNAME,
                    //         lname: data.LASTNAME,
                    //         nameAsAppears: data.FIRSTNAME + ' ' + data.LASTNAME,
                    //         email: data.EMAIL.toLowerCase(),
                    //         major: '',
                    //         major2: '',
                    //         minor: '',
                    //         quote: ''
                    //     }); // overwrite non-confirmed student with new information
                    //     console.log('Updated student: ' + data.EMAIL)
                    } else {
                        console.log('Skipped student: ' + data.EMAIL)
                    }
                })
            } catch (err) {
                console.log(err.message);
            }

        })
        .on('end', function () {
            console.log('Import complete.')
        });
}

function crosscheck(path) {
    process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
    const mongoose = require('../middlewares/mongoose');
    var Student = require('../models/student');
    const crypto = require('crypto');

    var emails = [];

    // load csv
    const fs = require('fs');
    const csv = require('csv-parser');

    fs.createReadStream(path)
        .pipe(csv())
        .on('data', function (data) {
            emails.push(data.EMAIL.toLowerCase());
            try {
                Student.findOne({
                    email: data.EMAIL.toLowerCase()
                }, (err, student) => {
                    if (!student) {
                        console.log("Student not found in databse: " + data.EMAIL.toLowerCase())
                    }
                })
            } catch (err) {
                console.log(err.message);
            }

            // console.log("%d students added. %d students skipped.", student_added, student_exists);
        })
        .on('end', function () {
            console.log('Done')
        });

    Student.find({}, (err, students) => {
        students.forEach((student) => {
            if (emails.indexOf(student.email) == -1) {
                console.log("Student not found in CSV: " + student.email);
            }
        })
    })
}

