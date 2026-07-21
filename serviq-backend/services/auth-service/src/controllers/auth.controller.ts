import express, { Request, Response } from "express"
import { AppError } from "../utils/appError";
import { sendEmailService } from "../services/otp.service";
import { ApiResponse } from "../types/apiResponse.types";
import { signUpService } from "../services/auth.service";
import { loginService } from "../services/auth.service";
import { forgotPasswordService, verifyOtpServiceCall, resetPasswordService, updatePasswordService } from "../services/password.service";
import { getRedisClient } from "../config/redis.config";
import jwt from "jsonwebtoken";

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
            // data: newOtp
        } as ApiResponse<null>)
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
        const { fullName, email, password,confirmPassword, role, otp } = req.body;
        console.log(req.body);
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
        // if (password !== confirmPassword) {
        //     throw new AppError("Password and Confirm Password should be same", 422);
        // }
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
        const client=getRedisClient();
        //fetch userIp address

        const clientIpAddress=req.ip;
        const key=`${clientIpAddress}:request_count`;

        const requestCount= await client.incr(key);
        if(requestCount==1){
            await client.expire(key,60);
        }
        if(requestCount>10){
            throw new AppError("Too many request try after some time",429);
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

export const forgotPasswordController = async(req: Request, res: Response) => {
    try{
        console.log(req.body)
        //fetch data from request body
        const { email } = req.body;
        //check if email is provided
        if(!email){
            throw new AppError("Please provide email", 400);
        }
        //call service to send reset password link
        const resetPasswordServiceCall = await forgotPasswordService({email});

        res.status(200).json({
            success: true,
            message: "Reset password OTP sent successfully",
        } as ApiResponse<null>);

    }
    catch(error:any){
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const forgotPasswordVerifyOtpController = async(req: Request, res: Response) => {
    try{

        //fetch data from request body
        const { email, otp } = req.body;
        //check if email and otp is provided
        if(!email || !otp){
            throw new AppError("Please provide email and otp", 400);
        }
        if(otp.length !== 4) {
            throw new AppError("Otp should be 4 digit", 400);
        }
        //call service to verify otp
        const verifyOtpResult = await verifyOtpServiceCall({ email, otp });
        console.log("verifyOtpResult", verifyOtpResult);


        res.status(200).json({
            success: true,
            message: "Otp verified successfully",
            data: verifyOtpResult
        } as ApiResponse<typeof verifyOtpResult>);

    }
    catch(error:any){
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const resetPasswordController = async(req: Request, res: Response) => {
        try{
            //fetch data from request body
            const {newPassword, confirmPassword, token } = req.body;
            //check if email and new password is provided
            if(!newPassword || !confirmPassword){
                throw new AppError("Please provide new password, confirm new password", 400);
            }
            if(!token){ 
                throw new AppError("Please provide token or something went wrong while fetching the token", 400);
            }
            if(newPassword.length < 8){
                throw new AppError("New password should be atleast 8 charcters long", 422);
            }
            if(newPassword !== confirmPassword){
                throw new AppError("New password and Confirm new password should be same", 422);
            }
            //call service to reset password
            const resetPasswordResult = await resetPasswordService({newPassword, token });

            res.status(200).json({
                success: true,
                message: "Password reset successfully",
                data: resetPasswordResult
            } as ApiResponse<typeof resetPasswordResult>);

        }
        catch(error:any){
            console.log(error);
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Sever Error"
            })
        }   
}

export const updatePasswordController = async(req: Request, res: Response) => {
    try{
        // console.log("Api hit");

        // const userIdHeader = req.headers['userId'];

      console.log("User header data: ",req.headers.userid);

        // if (!userIdHeader || Array.isArray(userIdHeader)) {
        //     throw new AppError("User not found", 404);
        // }
        const userId = req.headers.userid;
        const {oldPassword, newPassword, confirmPassword} = req.body;
        if(!userId){
            throw new AppError("Unable to fetch userId from header token",404);
        }
        if(!oldPassword || !newPassword){
            throw new AppError("Please provide oldPassword and newPassword", 400);
        }
        if(newPassword.length < 8){
            throw new AppError("New password should be atleast 8 charcters long", 422);
        }
        if(newPassword !== confirmPassword){
            throw new AppError("New password and Confirm new password should be same", 422);
        }

        const updatePasswordResult = await updatePasswordService({ userId, oldPassword, newPassword });

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: updatePasswordResult
        } as ApiResponse<typeof updatePasswordResult>);

    }
    catch(error:any){
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const logoutController = async (req: Request, res: Response) => {
    try {
        // Blacklist the access token from Authorization header if present
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded: any = jwt.decode(token);
                if (decoded?.exp) {
                    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
                    if (ttl > 0) {
                        const client = getRedisClient();
                        await client.set(`blacklisted_token:${token}`, "1", { EX: ttl });
                    }
                }
            } catch (_) {
                // Token invalid or already expired — silently continue
            }
        }

        // Clear the HTTP-only cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        } as ApiResponse<null>);
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
