import express = require('express');
export const authRouter = express.Router();

import { sendMagicLink } from './sendMagicLink';
authRouter.get('/sendMagicLink', sendMagicLink)