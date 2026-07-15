import { User } from "../model/user.model";
import { AppError } from "../utils/appError";
import { Otp } from "../model/otp.model";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

interface ISignUpData {
    fullName: string;
    email: string;
    password: string;
    role: "User" | "Admin" | "Worker";
    otp: string;
}
export const signUpService = async (data: ISignUpData)=>{
    const {fullName,email,password,role,otp} = data;
    //check if user already exists
    const existingUser = await User.findOne({ email: email  });
    if (existingUser) {
        throw new AppError("User already exists with this email", 409);
    }

    //find latest otp for this email
    const latestOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 }).exec();

    if (!latestOtp || latestOtp.otp !== otp) {
        throw new AppError("Invalid OTP or OTP has expired", 400);
    }

    //HASH the PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await User.create({
        fullName: fullName,
        email: email,
        password: hashedPassword,
        role: role
    });
    //delete the used otp
    await Otp.deleteMany({ email: email });

    const payload = {
        email:email,
        role:role,
        userId:newUser._id
    }

    const token = await jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY ?? "default_secret", { expiresIn: "1h" });

    // const userObj=  JSON.parse(JSON.stringify(newUser));  // Convert Mongoose document to plain object
    const userObj: any = newUser.toObject(); // Convert Mongoose document to plain object
    userObj.token = token; // Add the token to the user object
    userObj.password = undefined; // Remove the password field from the user object


    return userObj;

}

