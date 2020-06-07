import express = require('express');
import { Student } from '../../types/Student';
import { userCollection } from '../../middleware/firestore';

export function userPut(req: any, res: express.Response, next: express.NextFunction): void {
    if (!req.user.admin) return next("Insufficient permissions to perform this operation.")

    // TODO: perform body validation before insert
    userCollection.doc(req.body.email).set(new Student({
        email: req.user.email,
        name: {
            first: "John",
            last: "Doe"
        }
    }).toObject())
    .then(_ => {
        res.json({
            error: false,
            result: {}
        })
    })
    .catch(err => {
        console.log(err)
    })

}