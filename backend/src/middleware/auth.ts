import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import env from "../util/validateEnv";
import { RequestHandler } from "express";

export const authenticateUser: RequestHandler = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (token == null) return next(createHttpError(401, "User not authenticated"))

    if (token) {
        jwt.verify(token, env.JWT_KEY, (err, user: any) => {
            console.log("jwt user :", user)
            if (err) return next(createHttpError(403, "Token not valid"))
            req.body.userId = user.userId
            next();
        })
    } else {
        next(createHttpError(401, "User not authenticated"))
    }
}