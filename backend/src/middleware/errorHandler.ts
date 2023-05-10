import { logEvents } from "./logger";
import { isHttpError } from "http-errors";
import { ErrorRequestHandler } from 'express';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler: ErrorRequestHandler = ((error, req, res, next) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;

    logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log")

    console.log(error.stack)

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});