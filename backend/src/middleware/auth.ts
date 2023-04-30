import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    console.log("title =>")
    console.log("data :", req.session.userId)
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"))
    }
}