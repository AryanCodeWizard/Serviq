import mongoose from "mongoose";

interface IOtp{
    email:string,
    otp:string,
    createdAt: Date;

}
const otpSchema = new mongoose.Schema<IOtp>({
    email:{
        type: String,
        required:[true,"Email Is required"]
    },
    otp:{
        type:String,
        required:[true,"Otp is required"],
        maxLength: 4
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 5*60
    }
})
export const Otp = mongoose.model<IOtp>("Otp",otpSchema);