process.env['NODE_ENV'] = 'production'; // sets production env var before loading mongoose
const mongoose = require('../middlewares/mongoose');
var Student = require('../models/student');

Student.find({}, (err, students) => {
    students.forEach((student) => {
        student.pictured = true;
        student.save();
        console.log('Updated student: ' + student.email);
    })
}) 