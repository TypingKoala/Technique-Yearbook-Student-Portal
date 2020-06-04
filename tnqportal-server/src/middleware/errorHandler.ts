import express = require('express');

/**
 * Function that handles errors by sending a JSON message with error message
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function errorHandler (err: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
    res.status(500).json({
        error: true,
        errorMessage: err
    })
}