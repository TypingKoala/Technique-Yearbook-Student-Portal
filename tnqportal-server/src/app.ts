import dotenv from 'dotenv';
dotenv.config();

import express = require('express');
const app: express.Application = express();

import bodyParser = require('body-parser');

// custom response middleware for success responses
import { customResponse } from './middleware/customResponse';
app.use(customResponse);

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({
        success: true
    });
});

import { apiRouter } from './routes'
app.use('/api', apiRouter);

// error handler that handles any explicit errors
import { errorHandler } from './middleware/errorHandler';
app.use(errorHandler);

app.listen(3000, () => {
    console.log('Listening on port 3000!');
})