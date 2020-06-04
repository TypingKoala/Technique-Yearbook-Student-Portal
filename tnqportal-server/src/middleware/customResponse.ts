import express = require('express');

export function customResponse (req: express.Request, res: express.Response, next: () => void): void {
    res.success = (responseBody: any): void => {
        res.json({
            error: false,
            result: responseBody
        })
    }
    next();
}