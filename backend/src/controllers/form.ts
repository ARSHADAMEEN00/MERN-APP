import { RequestHandler } from "express";
import FormModel from "../models/form"
import createHttpError from "http-errors";


export const getFormData: RequestHandler = async (req, res, next) => {
    const search = req.query.search;
    const page = req.query.page
    const limit = req.query.limit || "10"

    const queryData: any = {
        $or: [
            { name: { $regex: search ? search : "", $options: "i" } },
            { dob: { $regex: search ? search : "", $options: "i" } }
        ]
    }
    console.log("data :", req.query)

    // if (req.query.sort === 'male') {
    //     queryData["gender"] = 'male';
    // }

    try {
        const formData = await FormModel.find(queryData).sort({ name: 1 }).limit(Number(limit)).skip((Number(page ? page : 1) - 1) * Number(limit))
        res.status(200).json(formData)

    } catch (error) {
        next(error)
    }
}


interface SignUpBody {
    name?: string,
    mobile?: number,
    dob?: string,
    gender?: string,
    idType?: string,
    idNumber?: string,
    guardianLabel?: string,
    guardianName?: string,
    email?: string,
    emergencyContact?: string,
    address?: string,
    state?: string,
    city?: string,
    pinCode?: string,
    country?: string,
    occupation?: string,
    religion?: string,
    maritalStatus?: string,
    bloodGroup?: string,
    nationality?: string,
}

export const createForm: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    console.log("data :", req.body)
    try {
        const newForm = await FormModel.create(req.body)
        res.status(201).json(newForm)
    } catch (error) {
        next(error)
    }

};
