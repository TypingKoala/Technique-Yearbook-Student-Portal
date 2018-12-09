/*jshint esversion: 6 */

// Requires
const express = require('express');
const app = express.Router();
const mongoose = require('../middlewares/mongoose');
var passport = require('passport');
const Student = require('../models/student.js');
var session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Require and Initialize Sessions & MongoStore
const MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: process.env.mongoStoreSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: null
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Use helmet
app.use(helmet());

// Initialize Express-Flash
const flash = require('express-flash');
app.use(session({ 
    secret: process.env.mongoStoreSecret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure OIDC
const {
    Issuer
} = require('openid-client');
const mitIssuer = new Issuer({
    issuer: 'https://oidc.mit.edu/',
    authorization_endpoint: 'https://oidc.mit.edu/authorize',
    token_endpoint: 'https://oidc.mit.edu/token',
    userinfo_endpoint: 'https://oidc.mit.edu/userinfo',
    jwks_uri: 'https://oidc.mit.edu/jwk',
}); // => Issuer
console.log('Set up issuer MIT');
const client = new mitIssuer.Client({
    client_id: process.env.oidc_client_id,
    client_secret: process.env.oidc_client_secret
});
client.CLOCK_TOLERANCE = 5; // to allow a 5 second skew
console.log('Set up client MIT');
const {
    Strategy
} = require('openid-client');


// Set up redirect_uri based on Node Environment
if (process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://tnqportal.mit.edu/auth/cb';
} else {
    var redirect_uri = 'http://localhost:3000/auth/cb';
}
// Parameters for OIDC
const params = {
    scope: "email,profile,openid",
    redirect_uri
};
passport.use('oidc', new Strategy({
    client,
    params
}, (tokenset, userinfo, done) => {
    // Checks if userinfo.email is defined
    if (userinfo.email) {
        Student.findOne({
            email: userinfo.email
        }, function (err, user) {
            if (err) return done(err, false, { message: "A server error occured. "});
            if (!user) {
                console.log('User not found: ' + userinfo.email);
                return done(null, false, { message: 'We were unable to verify that you are a senior. Please contact support.' });
            } else {
                return done(null, user);
            }
        });
    } else {
        // If userinfo.email is not defined, then user has not given appropriate permissions
        console.log('Appropriate permissions not given.');
        return done(null, false, { message: 'You did not give the application permission to view your email. Please contact support.' });
    }
}));


// Serialize and Deserialize Passport Sessions
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    Student.findById(id, function (err, user) {
        done(err, user);
    });
});

// Static Server
app.use(express.static('public'));

// Routes
app.use(require('./home'));
app.use(require('./signin'));
app.use(require('./edit'));

// GET /signout
app.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/signin');
});

// 404
app.use((req, res, next) => {
    res.status = 404;
    res.sendfile('/public/404.html');
});

module.exports = app;