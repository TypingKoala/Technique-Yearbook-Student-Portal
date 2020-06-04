import express = require('express');

exports.default = (req: express.Request, res: express.Response) => {
    res.json({
        email: "test@mit.edu",
        name: {
            first: "John",
            last: "Doe",
            preferred: "John Doe"
        },
        bio: {
            hometown: "",
            quote: ""
        },
        academic: {
            major: "",
            major2: "",
            minor: ""
        },
        metadata: {
            confirmed: false,
            editable: true
        }
    })
}