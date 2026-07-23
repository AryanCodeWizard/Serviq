import User from "../models/user.model"
import { AppError } from "../utils/appError";
interface IUserProfileData {
    authUserId:string,
    email:string,
    fullName:string,
    profileImage:string,
    role: "User" | "Worker" | "Admin"
}
export const createUserProfileService = async(data:IUserProfileData)=>{
        const {authUserId,role,profileImage,fullName,email} = data;

        //check is user profile already existe or not

        const isProfileExist = await User.findOne({authUserId:authUserId})

        if(isProfileExist){
            throw new AppError("User Profile already created",400);
        }

        const newProfile = await User.create({
            authUserId:authUserId,
            fullName:fullName,
            role:role,
            profileImage: profileImage,
            email:email,
        });

        console.log("Prfoile ban gyii re",newProfile);

        return newProfile
}