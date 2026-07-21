import type { forgotPasswordPayload, forgotPasswordVerifyOTPPayload, loginPayload, resetPasswordPayload, signUpPayload } from "../../../types/auth";
import {signupMailSendAPI,loginAPI} from "../../../api/auth"
import {verifyOTPAPI} from "../../../api/auth"
import { forgotPasswordAPI } from "../../../api/auth";
import {forgotPasswordVerifyOTP, resetPasswordAPI, logoutAPI} from "../../../api/auth";

export const signupMailSendAPICall = async(data: signUpPayload)=>{
    const response  = await signupMailSendAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data;
    
}

export const signupOTPVerifyCall = async(data: any)=>{
    const response  = await verifyOTPAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data;
    
}

export const loginAPICall = async(data: loginPayload)=>{
    const response = await loginAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while logging");
    }
    return response.data;
}


export const forgotPasswordAPICall = async(data: forgotPasswordPayload)=>{
    console.log(data);
    const response  = await forgotPasswordAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while calling forgot password");
    }
    return response.data;
}

export const forgotPasswordVerifyOTPCall = async(data: forgotPasswordVerifyOTPPayload) => {
    console.log(data);
    const response  = await forgotPasswordVerifyOTP(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while verifying OTP");
    }
    return response.data;
}

export const resetPasswordAPICall = async(data: resetPasswordPayload) => {
    const response = await resetPasswordAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while resetting password");
    }
    return response.data;
}

export const logoutAPICall = async(accessToken?: string | null) => {
    const response = await logoutAPI(accessToken);
    if(!response?.data?.success){
        throw new Error ("Error occurred while logging out");
    }
    return response.data;
}