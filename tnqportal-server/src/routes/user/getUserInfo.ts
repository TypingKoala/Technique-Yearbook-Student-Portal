import express = require('express');
import { Student } from '../../types/Student';

export function getUserInfo (req: any, res: express.Response, next: express.NextFunction): void {
    if (res.success) {
        res.success(new Student({
            email: req.user.email,
            name: {
                first: "John",
                last: "Doe"
            }
        }).toObject());
    } else {
        next("Server failure: unable to send successful response.")
    }
}