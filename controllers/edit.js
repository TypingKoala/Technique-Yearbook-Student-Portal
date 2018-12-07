/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student.js');
const { check, validationResult } = require('express-validator/check');

app.get('/edit', (req, res) => {
    if (req.user) {
        res.render('edit', {
            title: 'Edit',
            user: req.user,
            failure: req.flash('failure'),
        })
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
    check('minor').trim().isString().trim(),
    check('quote').trim().isLength({min: 0, max: 130}).withMessage('Your quote must be less than 130 characters.')
], (req, res, next) => {
    if (req.user) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('failure', errors.array({onlyFirstError: true})[0].msg);
            console.log(errors.array({onlyFirstError: true})[0].msg)
            return res.redirect('back');                
        }
        req.user.set({
            fname: req.body.fname,
            lname: req.body.lname,
            nameAsAppears: req.body.nameAsAppears,
            major: req.body.major,
            major2: req.body.major2,
            minor: req.body.minor,
            quote: req.body.quote,
            confirmed: false
        });
        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            res.redirect('/')
        })
    } else {
        res.redirect('/signin')
    }
});

app.post('/confirm', (req, res, next) => {
    if (req.user) {
        req.user.confirmed = true;
        req.user.save((err, updatedUser) => {
            if (err) return next(err);
            res.redirect('/')
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;