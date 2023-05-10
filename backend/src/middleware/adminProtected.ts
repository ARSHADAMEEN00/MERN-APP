import createHttpError from "http-errors";
import { RequestHandler } from "express";
import UserModel from "../models/user"

export const isAdminProtected: RequestHandler = async (req, res, next) => {
    const { userId } = req.body.UserInfo

    try {
        const user = await UserModel.findById(userId).select("-password").exec();
        if (!user) {
            return next(createHttpError(404, "User Not Found"))
        }
        if (user?.roles?.includes('admin')) {
            req.body.loggedUser = user
            next();
        } else next(createHttpError(401, "Your not an admin, only admin can access this"))

    } catch (error) {
        next(createHttpError(401, "User not authenticated"))
    }
}
