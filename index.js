/*jshint esversion: 6 */
/*jshint node: true */

'use strict';

// Start dotenv
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

// Variables
const port = process.env.PORT || 3000;
if (!process.env.FQDN) {
    throw new Error('FQDN not specified');
}


// Initialize express
const express = require('express');
const app = express();

// Require Sentry
const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://8d38ee4fdc124237b7d0a8e7dd4db12c@sentry.io/1335380'
});
app.use(Sentry.Handlers.requestHandler());

// Set render engine
const pug = require('pug');
app.set('view engine', 'pug');

// Initialize routes
const routes = require('./controllers');
app.use(routes);

// The error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
});

// Start Server
app.listen(port, () => {
    console.log('The magic happens at http://'+ process.env.FQDN + ':' + port + '.');
});