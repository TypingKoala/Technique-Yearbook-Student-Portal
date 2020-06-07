import express = require('express');
export const userRouter = express.Router();

import jwtVerify = require('express-jwt');
import env = require('env-var');

userRouter.get("/", (req, res) => {
    res.send("User")
})

import { userInfoGet, userInfoPost } from './userInfo';
userRouter.get('/userInfo',
    jwtVerify({
        secret: env.get('JWT_TOKEN_KEY').required().asString(),
        issuer: env.get('JWT_TOKEN_ISS').required().asString()
    }),
    userInfoGet
    )

userRouter.post('/userInfo',
    jwtVerify({
        secret: env.get('JWT_TOKEN_KEY').required().asString(),
        issuer: env.get('JWT_TOKEN_ISS').required().asString()
    }),
    userInfoPost
    )