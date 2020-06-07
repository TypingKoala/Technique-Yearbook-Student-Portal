import express = require('express');
export const adminRouter = express.Router();

import jwtVerify = require('express-jwt');
import env = require('env-var');


import { userPut } from './userPut';
adminRouter.put('/user',
    jwtVerify({
        secret: env.get('JWT_TOKEN_KEY').required().asString(),
        issuer: env.get('JWT_TOKEN_ISS').required().asString()
    }),
    userPut
    )