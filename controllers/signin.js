/* jshint esversion:6 */
// Require Express
const express = require('express');

// Intitialize App
const app = express.Router();

// Initialize Passport.js
var passport = require('passport');

// require the app secret decryption middleware
const appSecret = require('../middlewares/cryptr').decryptAppSecret;

// Initialize Express-Recaptcha
var Recaptcha = require('express-recaptcha').RecaptchaV2;
//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha(appSecret('recaptchaSiteKey'), appSecret('recaptchaSecretKey'));

// Import student
const Student = require('../models/student.js');

// Import email transporter and pug
const pug = require('pug');
const emailTransporter = require('../controllers/email').sendPromise;

// GET /signin
app.get('/signin', recaptcha.middleware.render, (req, res) => {
    res.render('signin', {
        message: req.flash('error'),
        success: req.flash('success'),
        recaptcha: res.recaptcha
    });
});

app.post('/signin', recaptcha.middleware.verify, (req, res) => {
    if (!req.recaptcha.error) {
        Student.findOne({
            email: req.body.email.toLowerCase()
        }, (err, student) => {
            if (student) {
                fields = {
                    title: "Your requested login link to the Technique Portal",
                    preheader: "Looks like you requested a link to edit your yearbook biographical information.",
                    superheader: 'Hey ' + student.fname + ',',
                    header: "Here's your magic link!",
                    paragraph: "You just requested a link to log into the Technique Portal, so here it is! If you didn't request one, that means someone probably entered your email accidentally. Without this email, rest assured that they won't be able make any changes to your yearbook entry.",
                    records: {},
                    buttonLink: 'http://tnqportal.mit.edu/authkey/' + student.authKey,
                    buttonText: 'Log in now.'
                };
                html = pug.renderFile('./views/emailtemplate.pug', fields);
                var message = {
                    from: 'Technique <technique@mit.edu>',
                    to: student.email,
                    subject: "Your requested login link to the Technique Portal",
                    html
                };
                emailTransporter(message).then(() => {
                    console.log(`magic link sent successfully to ${student.email}`);
                }).catch((err) => {
                    req.flash('error', 'Something went wrong sending a link to you. Please contact us.');
                    res.redirect('/signin');
                });
                req.flash('success', 'A link has been sent to your email to log in.');
                res.redirect('/signin');
            } else {
                req.flash('error', 'We could not verify that you are a senior. Please contact us.');
                res.redirect('/signin');
            }
        })
    } else {
        req.flash('error', "We were unable to determine whether or not you are human.");
        res.redirect('/signin');
    }
})

app.get('/authkey/:authkey', (req, res) => {
    Student.findOne({
        authKey: req.params.authkey
    }, (err, student) => {
        if (!student) {
            req.flash('error', "Unable to log in with your key. Please contact support.");
            res.redirect('/signin');
        } else {
            req.login(student, (loginError) => {
                if (loginError) {
                    return next(loginError);
                }
                return res.redirect('/');
            })
        }
    })
})



module.exports = app;