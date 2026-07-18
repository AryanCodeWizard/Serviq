import { User } from "../model/user.model";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { RedisClient } from "redis";
import { getRedisClient } from "../config/redis.config";

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
    // const latestOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 }).exec();
    const client = getRedisClient();
    const latestOtp = await client.get(`signup_otp:${email}`);

    if (!latestOtp || latestOtp !== otp) {
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

    const payload = {
        email:email,
        role:role,
        userId:newUser._id
    }

    const accessToken = await jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_JWT_SECRET ?? "default_secret", { expiresIn: "10min" });
    const refreshToken = await jsonwebtoken.sign(payload,process.env.REFRESH_TOKEN_JWT_SECRET ?? "default_secret",{expiresIn:"7d"})



    // const userObj=  JSON.parse(JSON.stringify(newUser));  // Convert Mongoose document to plain object
    const userObj: any = newUser.toObject(); // Convert Mongoose document to plain object
    userObj.accessToken = accessToken; // Add the token to the user object
    userObj.refreshToken = refreshToken;
    userObj.password=undefined // Remove the password field from the user object


    return userObj;

}

export const loginService = async (data: { email: string, password: string }) => {
    const { email, password } = data;
    //check if user exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        throw new AppError("User does not exist with this email", 404);
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid password", 401);
    }

    const payload = {
        email: email,
        role: existingUser.role,
        userId: existingUser._id
    } // Log the secret key for debugging

    const token = await jsonwebtoken.sign(payload, process.env.JWT_SECRET_KEY ?? "default_secret", { expiresIn: "1h" });

    const userObj: any = existingUser.toObject(); // Convert Mongoose document to plain object
    userObj.token = token; // Add the token to the user object
    userObj.password = undefined;
    console.log(userObj);    // Remove the password field from the user object

    return userObj; 
}

