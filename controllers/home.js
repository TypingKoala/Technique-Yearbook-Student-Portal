/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student.js');
var xssFilters = require('xss-filters');


app.get('/', (req, res, next) => {
    if (req.user) {
        res.render('home', {
            user: req.user,
            title: 'Home'
        }, (err) => {
            if (err) {
                console.log(err.message);
            }
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;