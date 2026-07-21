export type signUpPayload = {
    fullName: string,
    email:string,
    role: string,
    password: string
    confirmPassword: string,
    otp?:string
}
export type loginPayload = {
    email:string
    password:string
}
export type forgotPasswordPayload = {
    email:string
}
export type forgotPasswordVerifyOTPPayload = {
    email: string,
    otp: string
}
export type resetPasswordPayload = {
    newPassword: string,
    confirmPassword: string,
    token: string
}