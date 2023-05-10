import { RequestHandler, } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import NoteModel from "../models/note"
import asyncHandler from "express-async-handler";
import mongoose, { QueryOptions } from "mongoose";
import bcrypt from "bcrypt"

// get all user by admin
export const getAllUsers: RequestHandler = asyncHandler(async (req, res, next) => {
    const page = req.query.page
    const search = req.query.search
    const limit = req.query.limit || '10'
    const sort = req.query.sort
    const type = req.params.type

    const queryData: QueryOptions = {
        $or: [
            { username: { $regex: search ? search : "", $options: "i" } },
            { email: { $regex: search ? search : "", $options: "i" } },
        ],

    }

    if (type === "active") {
        queryData["isActive"] = true;
    }

    if (sort) {
        queryData["roles"] = sort
    }

    try {
        const user = await UserModel.find(queryData).sort({ createdAt: -1 }).select("-password").limit(Number(limit)).skip((Number(page ? page : 1) - 1) * Number(limit)).exec();
        if (!user?.length) {
            throw createHttpError(404, "User Not Found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export const getUserDetails: RequestHandler = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId
    try {
        const notes = await UserModel.find({ _id: userId }).exec();
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

interface SignUpBody {
    username?: string,
    password?: string,
    email?: string,
    userId?: string
    roles: Array<string>
}

export const createUser: RequestHandler<unknown, unknown, SignUpBody, unknown> = asyncHandler(async (req, res, next) => {
    const { username, password, email, roles } = req.body

    try {

        if (!username || !email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!Array.isArray(roles) || !roles.length) {
            throw createHttpError(404, "Please  Select a role, role is required for a user");
        }

        const existingUsername = await UserModel.findOne({ username: username }).lean().exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).lean().exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const hashedPass = await bcrypt.hash(password, 10) //hash password

        const newUser = await UserModel.create({
            email,
            username,
            password: hashedPass,
            roles
        })

        if (newUser) {
            res.status(201).json(newUser)
        } else {
            throw createHttpError(400, 'Invalid user data received')
        }
    } catch (error) {
        next(error)
    }
});

interface UpdatedUserBody {
    username?: string,
    email?: string,
    userId?: string
    user?: any
    roles?: Array<string>
    isActive: boolean,

}
interface UpdateUserParams {
    userId: string;
}

//update user
export const updateUser: RequestHandler<any, unknown, UpdatedUserBody, unknown> = asyncHandler(async (req, res, next) => {
    const { username, email, roles, isActive } = req.body
    const userId = req.params.userId;

    try {
        if (!username || !email || !Array.isArray(roles) || !roles?.length || typeof isActive !== 'boolean') {
            throw createHttpError(400, "Parameters missing");
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "invalid note id");
        }

        const user = await UserModel.findById({ _id: userId }).exec()

        const existingUsername = await UserModel.findOne({ username: username }).lean().exec();
        if (existingUsername && existingUsername?._id.toString() !== userId) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).lean().exec();
        if (existingEmail && existingEmail?._id.toString() !== userId) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        user.username = username
        user.email = email
        user.roles = roles
        user.isActive = isActive

        // const updatedUser = await UserModel.findByIdAndUpdate(
        //     { _id: userId },
        //     {
        //         email,
        //         username,
        //         roles,
        //         isActive
        //     }
        // );

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);

    } catch (error) {
        next(error)
    }
});

//delete user
export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId
    try {

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "invalid note id");
        }

        const notes = await NoteModel.findOne({ userId: userId }).lean().exec()

        if (notes) {
            return res.status(400).json({ message: 'User has assigned notes ' })
        }

        const user = await UserModel.findByIdAndDelete(userId)

        if (!user) {
            throw createHttpError(404, "User not found");
        }
        // const result = await user.deleteOne()

        res.status(204).json({
            userId: userId,
            message: "user deleted success"
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
};