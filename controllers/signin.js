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
app.get('/auth', passport.authenticate('oidc'));

// oidc authentication callback
app.get('/oidc/callback', passport.authenticate('oidc', {
    failureRedirect: '/signin',
    failureFlash: true
}), (req, res) => {
    // Wait until session saves before redirecting
    req.session.save(() => {
        var redirect = req.session.redirectAfterLogin || '/';
        req.session.redirectAfterLogin = "";
        res.redirect(redirect);
    });
});


module.exports = app;