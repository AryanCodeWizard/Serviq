import {fileUpload} from '../utils/cloudUpload';
import User from "../models/user.model"
import { AppError } from "../utils/appError";

interface IUserProfileData {
    authUserId: string,
    email: string,
    fullName: string,
    profileImage: string,
    role?: string,
}
interface IUpdateUserProfileData {
    authUserId: string,
    fullName: string,
    bio: string,
    skills: string[],
    experience: number,
    serviceCategory: string[],
}
interface IBecomeWorkerInterface {
    authUserId: string,
    address: string,
    serviceCategory: string[],
    experience: number,
    skills: string[],
    bio: string,
    phone: number,
    profileImage: any,
    adhaarCardNumber: string;
    panCardNumber: string
    citizenShip: string
    nativeLanguages: string[],
    age:number

}
interface IAddressUpdate {
    address: string,
    authUserId: string
}

export const createUserProfileService = async (data: IUserProfileData) => {
    const { authUserId, profileImage, fullName, email } = data;

    //check is user profile already exists or not
    const isProfileExist = await User.findOne({ authUserId: authUserId })

    if (isProfileExist) {
        throw new AppError("User Profile already created", 400);
    }

    const newProfile = await User.create({
        authUserId: authUserId,
        fullName: fullName,
        role: "User",
        profileImage: profileImage,
        email: email,
    });

    console.log("Profile ban gyii re", newProfile);

    return newProfile;
}

export const getUserProfileDetails = async (authUserId: string) => {
    const profile = await User.findOne({ authUserId: authUserId });

    if (!profile) {
        throw new AppError("User profile not found", 404);
    }

    return profile;
}

export const updateProfileDetailsService = async (data: IUpdateUserProfileData) => {
    const { authUserId, fullName, bio, skills, serviceCategory, experience } = data;

    //get user profile deatails
    const profile = await User.findOne({ authUserId: authUserId });
    if (!profile) {
        throw new AppError("User profile not found", 404);
    }

    const updateProfileDetails = await User.findOneAndUpdate({ authUserId: authUserId }, {
        bio: bio,
        fullName: fullName,
        experience: experience,
        serviceCategory: serviceCategory,
        skills: skills
    }, { new: true })

    console.log(updateProfileDetails);

    return updateProfileDetails;

}

export const becomeWorkerService = async (data: IBecomeWorkerInterface) => {
    const {authUserId,address,serviceCategory,experience,skills,bio,phone, adhaarCardNumber,panCardNumber,citizenShip,nativeLanguages,profileImage, age} = data;

    const userDetails = await User.findOne({ authUserId: authUserId });

    //check user if already worker or already applied
    if (userDetails?.role === 'Worker' && userDetails?.workerApplicationStatus === "Pending") {
        throw new AppError("User is already Applied for worker", 403);
    }
    if (userDetails?.role === 'Worker' && userDetails?.workerApplicationStatus === "Approved") {
        throw new AppError("User is already workder", 403);
    }
    if(userDetails?.isBlocked ===true) {
        throw new AppError("You are blocked by admin due to security reasons,Contact admin",400);
    }

    //upload the clietnt profile photo to clpudinary
 

    const uploadImage= await fileUpload(profileImage,process.env.CLOUDINARY_FOLDER_NAME!);

    const updatedUserProfile = await User.findOneAndUpdate({authUserId:authUserId},{
        role:"Worker",
        address:address,
        serviceCategory:serviceCategory,
        experience:experience,
        skills:skills,
        bio:bio,
        phone:phone,
        age:age,
        adhaarCardNumber:adhaarCardNumber,
        panCardNumber:panCardNumber,
        citizenShip:citizenShip,
        nativeLanguages:nativeLanguages,
        profileImage:uploadImage?.secure_url,
        profileImagePublicId:uploadImage?.public_id
    },{returnDocument:"after"})

    return updatedUserProfile;

}

export const addressUpdateService = async(data:IAddressUpdate)=>{
    const {address,authUserId} = data;

    const checkIfUserExist = await User.find({authUserId});
    if(!checkIfUserExist){
        throw new AppError("User not registered with us",404);
    }

    const existingUser = await User.findOneAndUpdate({authUserId:authUserId},{
        address: address,
    },{returnDocument:"after"});
    // console.log(existingUser)
    return existingUser;
}