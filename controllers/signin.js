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
var recaptcha = new Recaptcha(appSecret('recaptchaSiteKey'), appSecret('recaptchaSecretKey'))

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

// app.get('/signin/magic', (req, res) => {
//     res.render('passwordless', {
//         title: 'Sign In'
//     })
// })

// app.get('/auth/magiclink', recaptcha.middleware.verify,
//     passport.authenticate('magiclink', { action : 'requestToken' }),
//     (req, res) => {
//         console.log(req.recaptcha.error);
//         req.flash('success', 'Please check your inbox for your magic link.');
//         res.redirect('/signin');
//     }
// )

// app.get('/auth/magiclink/callback',
//   passport.authenticate('magiclink', { action : 'acceptToken' }),
//   (req, res) =>{
//       res.redirect('/');
//     }
// )


module.exports = app;