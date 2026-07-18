import api from "./axios"
import type {signUpPayload} from "../types/auth"

export const signupMailSendAPI = (data: signUpPayload) => {
    return api.post("/auth/send-email-auth",data)
}

export const verifyOTPAPI = (data:signUpPayload) => {
    return api.post("/auth/signUp",data);
}