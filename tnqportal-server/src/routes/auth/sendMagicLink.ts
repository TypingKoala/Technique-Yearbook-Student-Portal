import express = require('express');
import { Student, IName, IBio, IAcademic, IMetadata } from '../../types/Student';

export function sendMagicLink (req: express.Request, res: express.Response, next: express.NextFunction): void {
    // check if email is in database

    // load student object and generate JWT
    const name: IName = {
        first: "Jonathan",
        last: "Doe",
        preferred: "John Doe"
    };
    const bio: IBio = {
        hometown: "Cambridge",
        quote: "An apple a day keeps the doctor away."
    }
    const academic: IAcademic = {
        major: "6",
        major2: "18",
        minor: "CMS"
    }
    const metadata: IMetadata = {
        confirmed: true,
        editable: false,
        admin: true
    }
    const student = new Student({
        email: "jbui@mit.edu",
        name,
        bio,
        academic,
        metadata
    });

    if (res.success) {
        res.success(student.getJWT());
    } else {
        next("Server failure: unable to send successful response.")
    }
}