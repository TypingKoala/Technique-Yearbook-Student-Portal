/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student.js');
const {
    check,
    validationResult
} = require('express-validator/check');
const pug = require('pug');
const emailTransporter = require('./email').send;

function sendConfirmationEmail(user) {
    // Send confirmation email
    fields = {
        title: "Thanks for confirming your yearbook entry",
        preheader: 'We just wanted to send you a copy of your confirmed yearbook entry.',
        superheader: 'Hey ' + user.fname + ',',
        header: 'Thank you for confirming your yearbook entry!',
        paragraph: "You can view and edit your yearbook entry until February 14th. We have provided a copy below for your records. Do not forward this email to people you don't trust, since the link below automatically logs you in.",
        records: {
            "Name to sort by": user.fname + " " + user.lname,
            "Name to display": user.nameAsAppears,
            "Major": user.major,
            "Second Major": user.major2 || "<blank>",
            "Minor": user.minor || "<blank>",
            "Hometown": user.hometown || "<blank>",
            "Quote": user.quote || "<blank>"
        },
        buttonLink: 'http://tnqportal.mit.edu/authkey/' + student.authKey,
        buttonText: 'Edit your yearbook entry'
    };
    html = pug.renderFile('./views/emailtemplate.pug', fields);
    var message = {
        from: 'MIT Technique <technique@mit.edu>',
        to: user.email,
        subject: "Thanks for confirming your Technique entry",
        html
    };
    emailTransporter(message);
}

app.get('/edit', (req, res) => {
    if (req.user) {
        if (req.user.editable) {
            res.render('edit', {
                title: 'Edit',
                user: req.user,
                failure: req.flash('failure')
            });
        } else {
            res.send('You do not have permission to access this page.')
        }
    } else {
        res.redirect('/signin')
    }
});

app.post('/edit', [
    check('fname').trim().isString().not().isEmpty().isLength({
        min: 0,
        max: 200
    }).withMessage('First name is required.'),
    check('lname').trim().isString().not().isEmpty().isLength({
        min: 0,
        max: 200
    }).withMessage('Last name is required.'),
    check('nameAsAppears').trim().isString().not().isEmpty().isLength({
        min: 0,
        max: 400
    }).withMessage('Your name to appear in the yearbook is required.'),
    check('major').trim().isString().isLength({
        min: 0,
        max: 20
    }),
    check('major2').trim().isString().isLength({
        min: 0,
        max: 20
    }),
    check('minor').trim().isString().isLength({
        min: 0,
        max: 20
    }),
    check('hometown').trim().isLength({
        min: 0,
        max: 80
    }).withMessage('Your hometown can be up to 80 characters.'),
    check('quote').trim().isLength({
        min: 0,
        max: 130
    }).withMessage('Your quote can be up to 130 characters.')
], (req, res, next) => {
    if (req.user) {
        if (!req.user.editable) {
            req.flash('failure', "You don't have permission to edit this.");
            req.redirect('/edit');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('failure', errors.array({
                onlyFirstError: true
            })[0].msg);
            console.log(errors.array({
                onlyFirstError: true
            })[0].msg)
            return res.redirect('back');
        }
        req.user.set({
            fname: req.body.fname,
            lname: req.body.lname,
            nameAsAppears: req.body.nameAsAppears,
            major: req.body.major,
            major2: req.body.major2,
            minor: req.body.minor,
            hometown: req.body.hometown,
            quote: req.body.quote,
            confirmed: true
        });
        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            res.redirect('/');
            sendConfirmationEmail(updatedUser);
        });
    } else {
        res.redirect('/signin')
    }
});

app.post('/confirm', (req, res, next) => {
    if (req.user && req.user.editable) {
        req.user.confirmed = true;
        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            sendConfirmationEmail(updatedUser);
            res.redirect('/');
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;