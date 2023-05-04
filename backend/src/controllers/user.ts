import { RequestHandler, } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "../util/validateEnv";

// interface RequestData extends Request {
//     user: User
// }

// declare module 'express-serve-static-core' {
//     interface Request {
//         user: {
//             userId:string
//         }
//     }
// }



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const userId = req.body.userId
    try {
        const user = await UserModel.findById(userId).select("-password").exec();
        res.status(200).json(user)

    } catch (error) {
        next(error)
    }
}


interface SignUpBody {
    username?: string,
    password?: string,
    email?: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    try {
        if (!username || !email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({
            email,
            username,
        })

        const token = jwt.sign({ userId: newUser?._id }, env.JWT_KEY)

        const userWithToken = {
            user: newUser,
            token
        }

        // req.session.userId = newUser?._id
        // res.setHeader('set-cookie', `session_id=${req.session.id}; HttpOnly; SameSite=Strict`);
        res.status(201).json(userWithToken)
    } catch (error) {
        next(error)
    }

};

interface LoginBody {
    username: string,
    password: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email").exec()

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(400, "Password Not Match");
        }

        const token = jwt.sign({ userId: user && user?._id }, env.JWT_KEY)

        user['password'] = ''

        if (token) {
            const newUser = {
                user,
                token
            }
            req.session.userId = user?._id
            res.status(201).json(newUser)
        }
    } catch (error) {
        next(error)
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    })

}