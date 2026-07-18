import type { signUpPayload } from "../../../types/auth";
import {signupMailSendAPI} from "../../../api/auth"

export const signupMailSendAPICall = async(data: signUpPayload)=>{
    const response  = await signupMailSendAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data;
    
}


import {verifyOTPAPI} from "../../../api/auth"

export const signupOTPVerifyCall = async(data: any)=>{
    const response  = await verifyOTPAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data;
    
}