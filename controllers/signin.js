/* jshint esversion:6 */
// Require Express
const express = require('express');

// Intitialize App
const app = express.Router();

// Initialize Passport.js
var passport = require('passport');

// GET /signin
app.get('/signin', (req, res) => {
    res.render('signin', {
        message: req.flash('error')
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


module.exports = app;