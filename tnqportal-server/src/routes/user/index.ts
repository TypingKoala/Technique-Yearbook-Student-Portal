import express = require('express');
export const userRouter = express.Router();

import jwt = require('express-jwt')

userRouter.get("/", (req, res) => {
    res.send("User")
})

import { getUserInfo } from './getUserInfo';
userRouter.get('/getUserInfo', 
    jwt({ secret: process.env.JWT_TOKEN_KEY }),
    getUserInfo
    )