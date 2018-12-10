const mongoose = require('../middlewares/mongoose');
var Student = require('../models/student');

// load csv
const fs = require('fs'); 
const csv = require('csv-parser');

fs.createReadStream(process.argv[2])
.pipe(csv())
.on('data', function(data){
    try {
        Student.create({
            fname: data.First,
            lname: data.Last,
            nameAsAppears: data.First + ' ' + data.Last,
            email: data.Email,
            major: '',
            major2: '',
            minor: '',
            quote: ''
        });
    }
    catch(err) {
        console.log(err.message)
    }
})
.on('end',function(){
    console.log('done')
});  
