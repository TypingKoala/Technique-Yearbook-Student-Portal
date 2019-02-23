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
var Recaptcha = require('express-recaptcha').Recaptcha;

// Import student
const Student = require('../models/student.js');

// GET /signin
app.get('/signin', (req, res) => {
    res.render('signin', {
        message: req.flash('error'),
        success: req.flash('success'),
        cache: true
    });
});


// MIT OIDC endpoint and callback url
// oidc request
app.get('/auth', passport.authenticate('oidc', {
    failureRedirect: '/signin',
    failureFlash: true
}));

// oidc authentication callback
app.get('/auth/cb', passport.authenticate('oidc', {
    failureRedirect: '/signin',
    failureFlash: true
}), (req, res) => {
    // Wait until session saves before redirecting
    req.session.save(() => {
        res.redirect(301 ,'/');
    });
});

app.get('/authkey/:authkey', (req, res) => {
    Student.findOne({authKey: req.params.authkey}, (err, student) => {
        if (!student) {
            req.flash('error', "Unable to log in with your key. Please contact support.");
            res.redirect('/signin');
        } else {
            req.login(student, (loginError) => {
                if (loginError) { return next(loginError);}
                return res.redirect('/');
            })
        }
    })
})



module.exports = app;