import { User } from "../model/user.model";
import { AppError } from "../utils/appError";
import otpGenerator from "otp-generator";
import axios from "axios";
import { sendmailTemplate } from "../templates/mail.template";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { getRedisClient } from "../config/redis.config";

interface IForgotPasswordData {
    email: string;
}

interface IVerifyOtpData {
    email: string;
    otp: string;
}

interface IResetPasswordData {
    newPassword: string;
    token: string;
}

interface IUpdatePasswordData {
    userId: string | string[]; 
    oldPassword: string;
    newPassword: string;
}

export const forgotPasswordService = async (data: IForgotPasswordData) => {
    const email = data.email;

    //check if user exists with this email
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        throw new AppError("User does not exist with this email", 404);
    }

    // Example: 6-digit numeric otp
    const otp = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    //save the otp and expiry time in the user document
    // const newOtp = await Otp.create({
    //     email: email,
    //     otp: otp,
    // });

    //save otp to redis
    const client = getRedisClient();
    const newOtp = await client.set(`forgot_password_otp:${email}`,otp,{EX:300});


    const mailServiceBaseUrl = process.env.MAIL_SERVICE_URL ?? "http://localhost:5000";

    const mailServiceCall = await axios.post(`${mailServiceBaseUrl}/api/v1/send-mail`, {
        email: email,
        subject: "Your OTP for Password Reset",
        body: sendmailTemplate(existingUser.fullName, otp),
        from: "noreply@kamwale.com"
    });

}

export const verifyOtpServiceCall = async (data: IVerifyOtpData) => {
    const { email, otp } = data;
    //check if user exists with this email

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
        throw new AppError("User does not exist with this email", 404);
    }

    // const latestOtp= await Otp.findOne({ email: email }).sort({ createdAt: -1 });
    const client = getRedisClient();
    const latestOtp = await client.get(`forgot_password_otp:${email}`);

    if (!latestOtp) {
        throw new AppError("No OTP found for this email", 404);
    }
    if(otp.length !== 4) {
        throw new AppError("Otp should be 4 digit", 400);
    }
    if (latestOtp!== otp) {
        throw new AppError("Invalid OTP", 400);
    }

    // If OTP is valid, generate a token for password reset
    // You can use any method to generate a token, here we are using crypto

    const token = crypto.randomBytes(32).toString("hex");

    const updatedUser = await User.findOneAndUpdate({email: email}, {
        resetPasswordToken: token,
        resetPasswordExpiry: new Date(Date.now() + 3600000)
    }, {returnDocument: "after"} ).select("-password"); // Exclude password field from the returned user

    if (!updatedUser) {
        throw new AppError("Failed to update user with reset token", 500);
    }   
      console.log("OTP verified successfully. Use the token to reset your password.");
    
      return updatedUser; // Return the updated user with reset token and expiry
}

export const resetPasswordService = async (data: IResetPasswordData) => {
    const { newPassword, token } = data;
    
    // Find the user with the provided reset token and check if it's still valid
    const userDetails = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: new Date() }
    });


    if (!userDetails) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userDetails.password = hashedPassword;
    userDetails.resetPasswordToken = undefined;
    userDetails.resetPasswordExpiry = undefined;
    await userDetails.save();
    
    return { message: "Password reset successfully" };
}

export const updatePasswordService = async(data: IUpdatePasswordData)=>{
    const { userId, oldPassword, newPassword} = data;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AppError("Old password is incorrect", 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: "Password updated successfully" };

}