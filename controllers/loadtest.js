/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();
const Student = require('../models/student');

const settings = require('../config/settings.json');

if (settings.enableLoadTestEndpoint) {
    app.get('/loadtest', (req, res) => {
        Student.findOne({email: "loadtest@mit.edu"}, (err, user) => {
            if (err || !user) {
                return res.send('No loadtest user.')
            } else {
                return res.render('home', {
                    title: 'Home',
                    user
                });
            }
        })
    })
}


// Export router
module.exports = app;