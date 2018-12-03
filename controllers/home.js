/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student.js');
var xssFilters = require('xss-filters');


app.get('/', (req, res, next) => {
    if (req.user) {
        res.render('home', {
            user: req.user,
            title: 'Home',
            fname: xssFilters.inHTMLData(req.user.fname),
            lname: xssFilters.inHTMLData(req.user.lname),
            nameAsAppears: xssFilters.inHTMLData(req.user.nameAsAppears),
            major: xssFilters.inHTMLData(req.user.major),
            major2: xssFilters.inHTMLData(req.user.major2),
            minor: xssFilters.inHTMLData(req.user.minor),
            quote: req.user.quote
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;