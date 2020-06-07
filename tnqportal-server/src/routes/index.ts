import express = require('express');
export const apiRouter = express.Router();

import { userRouter } from './user'
apiRouter.use('/user', userRouter);

import { authRouter } from './auth'
apiRouter.use('/auth', authRouter);

import { adminRouter } from './admin'
apiRouter.use('/admin', adminRouter);