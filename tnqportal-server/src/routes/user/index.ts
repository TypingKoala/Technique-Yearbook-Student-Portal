import express = require('express');
export const userRouter = express.Router();

import jwtVerify = require('express-jwt');
import env = require('env-var');

userRouter.get("/", (req, res) => {
    res.send("User")
})

import { getUserInfo } from './getUserInfo';
userRouter.get('/getUserInfo',
    jwtVerify({
        secret: env.get('JWT_TOKEN_KEY').required().asString(),
        issuer: env.get('JWT_TOKEN_ISS').required().asString()
    }),
    getUserInfo
    )