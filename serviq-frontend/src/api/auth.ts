import api from "./axios";
import type { ApiResponse, AuthApiUser, forgotPasswordPayload, forgotPasswordVerifyOTPPayload, loginPayload, resetPasswordPayload, signUpPayload } from "../types/auth";

export const signupMailSendAPI = (data: signUpPayload) => {
    return api.post<ApiResponse<null>>("/auth/send-email-auth", data);
};

export const verifyOTPAPI = (data:signUpPayload) => {
    return api.post<ApiResponse<AuthApiUser>>("/auth/signUp", data);
};

export const loginAPI = (data: loginPayload) => {
    return api.post<ApiResponse<AuthApiUser>>("/auth/login", data);
};

export const forgotPasswordAPI = (data: forgotPasswordPayload)=>{
    return api.post<ApiResponse<null>>("/auth/forgot-password", data);
};

export const forgotPasswordVerifyOTP = (data: forgotPasswordVerifyOTPPayload) => {
    return api.post<ApiResponse<{ resetPasswordToken: string }>>("/auth/forgot-password/verify-otp", data);
};

export const resetPasswordAPI = (data: resetPasswordPayload) => {
    return api.post<ApiResponse<null>>("/auth/reset-password", data);
};

export const logoutAPI = (accessToken?: string | null) => {
    return api.post<ApiResponse<null>>("/auth/logout", {}, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
};