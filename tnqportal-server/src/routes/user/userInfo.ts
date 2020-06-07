import express = require('express');
import { Student, IStudent } from '../../types/Student';
import { userCollection } from '../../middleware/firestore';

function getStudentObjectFromDB(email: string, cb: (err: Error | null, student: Student) => void) {
    userCollection.doc(email).get()
    .then(doc => {
        if (!doc.exists) {
            cb(
                new Error("Current user was not found in the database."),
                new Student({ email: "null@null.com", name: { first: "null", last: "null" }})
            )
        } else {
            const student = new Student(doc.data() as IStudent)
            cb(null, student);
        }
    })
}

function updateStudentObjectInDB(email: string, newFields: IStudent, cb: (err: Error | null) => void) {

    getStudentObjectFromDB(email, (err, student) => {
        if (err) return cb(err);

        let studentObj = student.toObject();
        Object.assign(studentObj, newFields);
        let updatedStudent = new Student(studentObj);

        // TODO unsafe, should validate that email is not being changed
        userCollection.doc(email).set(updatedStudent.toObject())
        .then(writeResult => cb(null))
        .catch(_ => cb(
            new Error("Database error encountered when writing info.")
        ))
    });

}

export function userInfoGet(req: any, res: express.Response, next: express.NextFunction): void {
    getStudentObjectFromDB(req.user.email, (err, student) => {
        if (err) return next(err.message);

        res.json({
            error: false,
            result: student.toObject()
        })
    })
}

export function userInfoPost(req: any, res: express.Response, next: express.NextFunction): void {
    updateStudentObjectInDB(req.user.email, req.body, (err) => {
        if (err) return next(err.message)

        res.json({
            error: false,
            result: {message: "Updated successfully."}
        })
    })
}