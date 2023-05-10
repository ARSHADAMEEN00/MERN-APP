import { RequestHandler, } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import env from "../util/validateEnv";
import asyncHandler from "express-async-handler";


export const getAuthenticatedUser: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const { userId } = req.body.UserInfo

        try {
            const user = await UserModel.findById(userId).select("-password").lean().exec();
            // const user = await UserModel.findById(userId).select("-password").lean();
            if (!user) {
                throw createHttpError(404, "User Not Found");
            }
            res.status(200).json(user)

        } catch (error) {
            next(error)
        }
    }
)


interface SignUpBody {
    username?: string,
    password?: string,
    email?: string,
    userId?: string
    roles: Array<string>
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = asyncHandler(async (req, res, next) => {
    const roles: Array<string> = ['employee']
    const { username, password, email } = req.body

    try {

        if (!username || !email || !password) {
            throw createHttpError(400, "Parameters missing");
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

        if (newUser) { //user created success
            const token = jwt.sign({ userId: newUser?._id }, env.JWT_KEY)

            const userWithToken = {
                user: newUser,
                token
            }
            res.status(201).json(userWithToken)
        } else {
            throw createHttpError(400, 'Invalid user data received')
        }
    } catch (error) {
        next(error)
    }
});

interface LoginBody {
    username: string,
    password: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = asyncHandler(async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
        if (!username || !password) {
            throw createHttpError(400, 'All fields are required');
        }

        const user = await UserModel.findOne({ username: username }).select("+password +email").lean().exec()

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        if (!user?.isActive) {
            throw createHttpError(401, 'Unauthorized, User is not activated');
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw createHttpError(400, "Password Not Match");
        }

        user['password'] = ''

        // const token = jwt.sign({ userId: user && user?._id }, env.JWT_KEY)
        const token = jwt.sign({
            "UserInfo": {
                "userId": user._id,
                "username": user.username,
                "roles": user.roles
            }
        },
            env.JWT_KEY,
            { expiresIn: '1d' }
        )


        const refreshToken = jwt.sign(
            { "username": user.username }, env.JWT_KEY,
            { expiresIn: '1d' }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server
            secure: false, //https
            sameSite: "none", //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

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
})

export const refresh: RequestHandler = (req, res) => {
    const cookies = req.cookies

    console.log("cookies :", cookies)

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(refreshToken, env.REFRESH_JWT_KEY,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const user = await UserModel.findOne({ username: decoded.username })

            if (!user) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign({
                "UserInfo": {
                    "userId": user._id,
                    "username": user.username,
                    "roles": user.roles
                }
            },
                env.JWT_KEY,
                { expiresIn: '60s' }
            )

            res.status(200).json({ token: accessToken })

        })
}


export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error)
        } else {
            res.sendStatus(200)
        }
    })

    // const cookies = req.cookies

    // if (!cookies?.jwt) return res.sendStatus(204)

    // res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // res.sendStatus(200)

}


