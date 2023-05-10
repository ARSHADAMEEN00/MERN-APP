import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import env from "../util/validateEnv";
import { RequestHandler } from "express";

export const authenticateUser: RequestHandler = (req, res, next) => {
    // const authHeader = req.headers.authorization || req.headers.authorization

    // if (!authHeader?.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Unauthorized' })
    // }

    // const token = authHeader.split(' ')[1]
    const token = req.headers['authorization']?.split(' ')[1]
    if (token == null) return next(createHttpError(401, "User not authenticated"))

    if (token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jwt.verify(token, env.JWT_KEY, (err, decoded: any) => {
            console.log("jwt user :", decoded)
            if (err) return next(createHttpError(403, "Token not valid"))
            req.body.UserInfo = decoded.UserInfo
            next();
        })
    } else {
        next(createHttpError(401, "User not authenticated"))
    }
}