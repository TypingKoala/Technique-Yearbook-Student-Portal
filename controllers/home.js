/* jshint esversion: 6*/
const express = require('express');
const app = express.Router();


app.get('/', (req, res) => {
    if (req.user) {
        res.render('home', {
            title: 'Home',
            user: req.user
        })
    } else {
        res.redirect('/signin')
    }
})

// Export router
module.exports = app;