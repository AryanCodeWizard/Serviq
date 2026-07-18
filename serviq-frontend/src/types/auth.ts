export type signUpPayload = {
    fullName: string,
    email:string,
    role: string,
    password: string
    confirmPassword: string,
    otp?:string
}