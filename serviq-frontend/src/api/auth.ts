import api from "./axios"
import type {signUpPayload,loginPayload, forgotPasswordPayload, forgotPasswordVerifyOTPPayload, resetPasswordPayload} from "../types/auth"

export const signupMailSendAPI = (data: signUpPayload) => {
    return api.post("/auth/send-email-auth",data)
}

export const verifyOTPAPI = (data:signUpPayload) => {
    return api.post("/auth/signUp",data);
}

export const loginAPI = (data: loginPayload) => {
    return api.post("/auth/login",data);
}
export const forgotPasswordAPI = (data: forgotPasswordPayload)=>{
    return api.post("/auth/forgot-password",data);
}

export const forgotPasswordVerifyOTP = (data: forgotPasswordVerifyOTPPayload) => {
    return api.post("/auth/forgot-password/verify-otp", data);
}

export const resetPasswordAPI = (data: resetPasswordPayload) => {
    return api.post("/auth/reset-password", data);
}

export const logoutAPI = (accessToken?: string | null) => {
    return api.post("/auth/logout", {}, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });
}