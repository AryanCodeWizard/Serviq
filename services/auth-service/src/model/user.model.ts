import mongoose from "mongoose";

export interface IUser {
    fullName: string,
    email: string,
    password: string,
    role: "User" | "Worker" | "Admin"
}

const userSchema = new mongoose.Schema<IUser>({
    fullName:{
        type: String,
        trim: true,
        required: [true, "FullName field is missing"],
    },
    email:{
        type:String,
        unique:true,
        required: [true, "Email field is missing"]
    },
    password:{
        type: String,
        required: [true, "Password field is missing"]
    },
    role:{
        type: String,
        enum:["User","Worker","Admin"],
        default: "User"
    }
},{timestamps:true})

export const User = mongoose.model<IUser>("User",userSchema);
