// running 'node standalone/import.js <csvpath>' or 'node import.js <csvpath>' (depending on your current directory) will read the csv file at the 'csvpath' and import students line by line. 
// The first line should have titles for each column: 'First', 'Last', and 'Email'.


const mongoose = require('../middlewares/mongoose');
var Student = require('../models/student');

// load csv
const fs = require('fs');
const csv = require('csv-parser');

// fs.createReadStream(process.argv[2])
// .pipe(csv())
// .on('data', function(data){
//     try {
//         Student.create({
//             fname: data.First,
//             lname: data.Last,
//             nameAsAppears: data.First + ' ' + data.Last,
//             email: data.Email,
//             major: '',
//             major2: '',
//             minor: '',
//             quote: ''
//         });
//     }
//     catch(err) {
//         console.log(err.message)
//     }
// })
// .on('end',function(){
//     console.log('done')
// });  

Student.create({
    fname: 'Jane',
    lname: 'Doe',
    nameAsAppears: 'Jane Doe',
    email: 'doe@mit.edu',
    major: '',
    major2: '',
    minor: '',
    quote: ''
}, () => {
    process.exit();
});
