/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student.js');
const {
    check,
    validationResult
} = require('express-validator/check');
const pug = require('pug');
const emailTransporter = require('./email');

app.get('/edit', (req, res) => {
    if (req.user) {
        res.render('edit', {
            title: 'Edit',
            user: req.user,
            failure: req.flash('failure'),
        });
    } else {
        res.redirect('/signin')
    }
});

app.post('/edit', [
    check('fname').trim().isString().not().isEmpty().withMessage('First name is required.'),
    check('lname').trim().isString().not().isEmpty().withMessage('Last name is required.'),
    check('nameAsAppears').trim().isString().not().isEmpty().withMessage('Your name to appear in the yearbook is required.'),
    check('major').trim().isString(),
    check('major2').trim().isString(),
    check('minor').trim().isString(),
    check('quote').trim().isLength({
        min: 0,
        max: 130
    }).withMessage('Your quote must be less than 130 characters.')
], (req, res, next) => {
    if (req.user) {
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

        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            res.redirect('/');

            // Send confirmation email
            fields = {
                title: 'Your Confirmed Yearbook Entry',
                preheader: 'We just wanted to send you a copy of your confirmed yearbook entry.',
                superheader: 'Hey ' + req.body.fname + ',',
                header: 'Thank you for confirming your yearbook entry!',
                paragraph: 'You can view and edit your yearbook entry until Feburary 1st. We have provided a copy below for your records.',
                records: {
                    Name: req.body.nameAsAppears,
                    Major: req.body.major,
                    "Second Major": req.body.major2,
                    Minor: req.body.minor,
                    Quote: req.body.quote
                },
                buttonLink: 'http://tnqportal.mit.edu',
                buttonText: 'Visit the Technique Student Portal'
            };
            html = pug.renderFile('./views/emailtemplate.pug', fields);
            var message = {
                from: '"MIT Technique" technique@mit.edu',
                to: req.user.email,
                subject: 'Your Confirmed Yearbook Entry',
                html
            };
            emailTransporter(message);
            req.user.set({
                fname: req.body.fname,
                lname: req.body.lname,
                nameAsAppears: req.body.nameAsAppears,
                major: req.body.major,
                major2: req.body.major2,
                minor: req.body.minor,
                quote: req.body.quote,
                confirmed: true
            });
        });
    } else {
        res.redirect('/signin')
    }
});

app.post('/confirm', (req, res, next) => {
    if (req.user) {
        req.user.confirmed = true;
        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            // Send confirmation email
            fields = {
                title: 'Your Confirmed Yearbook Entry',
                preheader: 'We just wanted to send you a copy of your confirmed yearbook entry.',
                superheader: 'Hey ' + req.user.fname + ',',
                header: 'Thank you for confirming your yearbook entry!',
                paragraph: 'You can view and edit your yearbook entry until Feburary 1st. We have provided a copy below for your records.',
                records: {
                    Name: req.user.nameAsAppears,
                    Major: req.user.major,
                    "Second Major": req.user.major2,
                    Minor: req.user.minor,
                    Quote: req.user.quote
                },
                buttonLink: 'http://tnqportal.mit.edu',
                buttonText: 'Visit the Technique Student Portal'
            };
            html = pug.renderFile('./views/emailtemplate.pug', fields);
            var message = {
                from: '"MIT Technique" technique@mit.edu',
                to: req.user.email,
                subject: 'Your Confirmed Yearbook Entry',
                html
            };
            emailTransporter(message);
            res.redirect('/');
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;