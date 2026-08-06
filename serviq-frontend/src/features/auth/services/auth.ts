import type { AuthApiUser, AuthSession, forgotPasswordPayload, forgotPasswordVerifyOTPPayload, loginPayload, resetPasswordPayload, signUpPayload } from "../../../types/auth";
import { forgotPasswordAPI, forgotPasswordVerifyOTP, loginAPI, logoutAPI, resetPasswordAPI, signupMailSendAPI, verifyOTPAPI } from "../../../api/auth";
import type { ApiResponse } from "../../../types/auth";

const toAuthSession = (authUser: AuthApiUser): AuthSession => {
    const { accessToken, refreshToken, ...user } = authUser;

    return {
        accessToken,
        refreshToken,
        user,
    };
};

export const signupMailSendAPICall = async (data: signUpPayload): Promise<ApiResponse<null>> => {
    const response  = await signupMailSendAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data as ApiResponse<null>;
    
}

export const signupOTPVerifyCall = async (data: signUpPayload): Promise<AuthApiUser> => {
    const response  = await verifyOTPAPI(data);

    if(!response?.data?.success){
        throw new Error ("Error occurred during send email otp for signup");
    }
    return response.data.data as AuthApiUser;
    
}

export const loginAPICall = async (data: loginPayload): Promise<AuthApiUser> => {
    const response = await loginAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while logging");
    }
    return response.data.data as AuthApiUser;
}


export const forgotPasswordAPICall = async (data: forgotPasswordPayload): Promise<ApiResponse<null>> => {
    const response  = await forgotPasswordAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while calling forgot password");
    }
    return response.data as ApiResponse<null>;
}

export const forgotPasswordVerifyOTPCall = async (data: forgotPasswordVerifyOTPPayload): Promise<ApiResponse<{ resetPasswordToken: string }>> => {
    const response  = await forgotPasswordVerifyOTP(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while verifying OTP");
    }
    return response.data as ApiResponse<{ resetPasswordToken: string }>;
}

export const resetPasswordAPICall = async (data: resetPasswordPayload): Promise<ApiResponse<null>> => {
    const response = await resetPasswordAPI(data);
    if(!response?.data?.success){
        throw new Error ("Error occurred while resetting password");
    }
    return response.data as ApiResponse<null>;
}

export const logoutAPICall = async (accessToken?: string | null): Promise<ApiResponse<null>> => {
    const response = await logoutAPI(accessToken);
    if(!response?.data?.success){
        throw new Error ("Error occurred while logging out");
    }
    return response.data as ApiResponse<null>;
}

export const buildAuthSession = toAuthSession;