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

    Student.find({pictured: true}, (err, students) => {
        if (err) {
            console.log(err);
        }
        counter = students.length; // initialize decrementing counter to track # of callbacks after each student iteration
        emails = 0; // number of emails to send
        students.forEach(student => {
            // Send email
            fields = {
                title: '[ACTION REQUIRED] Confirm your yearbook bio information',
                preheader: "Thanks for taking your senior portrait! It's time to write your bio for Technique 2020. ",
                superheader: 'Hey ' + student.fname + ',',
                header: "Time to add your senior bio for Technique 2020!",
                paragraph: "You are receiving this email because you recently attended your senior portrait session. Now that we have your photo, let's figure out what to put next to it! Simply click on the link below to confirm your name spelling, major/minor information, hometown, and quote. If you do not confirm, we will only display your first and last name as the registrar provided us. You are able to edit your entry after confirming by using the link below. Please do not forward this email to others, because anyone with the link below will be able to change your entry.",
                records: {},
                buttonLink: 'http://tnqportal.mit.edu/authkey/' + student.authKey,
                buttonText: 'Login to the Technique Student Portal'
            };
            html = pug.renderFile('./views/emailtemplate.pug', fields);
            var message = {
                from: 'Technique Yearbook <technique@mit.edu>',
                to: student.email,
                subject: '[ACTION REQUIRED] Confirm your yearbook bio information',
                html
            };
            if (!dryRun) {
                emailTransporter(message).then(() => {
                    counter = counter - 1;
                    if (counter == 0) {
                        console.log("Emails sent: " + emails.toString());
                        process.exit();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log(student.email);
                counter--;
            }
            emails++;
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
                            fname: data.FirstName,
                            lname: data.LastName,
                            nameAsAppears: data.FirstName + ' ' + data.LastName,
                            email: data.EMAIL.toLowerCase(),
                            major: '',
                            major2: '',
                            minor: '',
                            quote: '',
                            hometown: '',
                            pictured: true,
                            authKey: crypto.randomBytes(32).toString('hex')
                        });
                        console.log('Added student: ' + data.EMAIL)
                    } else if (!student.pictured) {
                        Student.updateOne({
                                email: data.EMAIL.toLowerCase()
                            }, {
                                pictured: true
                            })
                            .then((val) => {
                                console.log('Updated student: ' + data.EMAIL)
                            })

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
                        console.log("Student not found in database: " + data.EMAIL.toLowerCase())
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