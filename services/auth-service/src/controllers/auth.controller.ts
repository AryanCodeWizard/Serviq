import express, { Request, Response } from "express"
import { IUser } from "../model/user.model";
import { AppError } from "../utils/appError";
import { sendEmailService } from "../services/otp.service";
import { ApiResponse } from "../types/apiResponse.types";
import { signUpService } from "../services/auth.service";
import { loginService } from "../services/auth.service";

export const sendEmailController = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, confirmPassword, role } = req.body;
        if (!fullName || !email || !password || !role) {
            throw new AppError("Please fill all the Inputs Field", 400);
        }
        if (password.length < 8) {
            throw new AppError("Password should be atleast 8 charcters long", 422);
        }
        if (password !== confirmPassword) {
            throw new AppError("Password and Confirm Password should be same", 422);
        }
        //service call

        const newOtp = await sendEmailService({ fullName, email });

        res.status(200).json({
            success: true,
            message: "Otp send successfully",
            data: newOtp
        } as ApiResponse<typeof newOtp>)
    }

    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const signUpController = async (req: Request, res: Response) => {
    try {
        //fetch data from request body
        const { fullName, email, password, confirmPassword, role, otp } = req.body;
        if (!fullName || !email || !password || !role || !otp) {
            throw new AppError("Please fill all the Inputs Field something is missing", 400);
        }
        if (!otp) {
            throw new AppError("Please provide otp", 400);
        }
        if (otp.length !== 4) {
            throw new AppError("Otp should be 4 digit", 400);
        }

        if (password.length < 8) {
            throw new AppError("Password should be atleast 8 charcters long", 422);
        }
        if (password !== confirmPassword) {
            throw new AppError("Password and Confirm Password should be same", 422);
        }
        //call service to create user [SIGNUP];

        const newUser = await signUpService({ fullName, email, password, role, otp });

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true, // Cookie accessible only by the server
        }

        res.cookie("token", newUser.token, options).status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        } as ApiResponse<typeof newUser>);



    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const loginController = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            throw new AppError("Please provide email and password", 400);
        }
        
        //call service to login user
        const user = await loginService({email, password});

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true, // Cookie accessible only by the server
        }

        res.cookie("token", user.token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        } as ApiResponse<typeof user>);
    }
    catch(error:any){   
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

