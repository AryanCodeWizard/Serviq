import { Request, Response } from "express"
import { AppError } from "../utils/appError";
import { UploadedFile } from "express-fileupload";
import { createUserProfileService, getUserProfileDetails, updateProfileDetailsService, becomeWorkerService } from "../services/profile.service"


export const createUserProfile = async (req: Request, res: Response) => {
    try {
        //fetch data from req body
        console.log(req.body);
        const { authUserId, email, fullName, profileImage, role } = req.body;


        if (!authUserId || !email || !fullName || !profileImage || !role) {
            throw new AppError("All fields are required", 400);
        }

        const createUserProfileServiceCall = await createUserProfileService({ authUserId, email, fullName, profileImage, role });

        res.status(201).json({
            success: true,
            message: "User Profil Ceated Successfully",
            data: createUserProfileServiceCall
        })
    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        })
    }
}

export const getProfileDetails = async (req: Request, res: Response) => {
    try {
        // HTTP headers are lowercased by Node.js — gateway sends "userid" (lowercase)
        const authUserId = req.headers["userid"] as string;

        console.log("Fetching profile for authUserId:", authUserId);

        if (!authUserId) {
            throw new AppError("User ID not found in request. Please make sure you are logged in.", 401);
        }

        const profile = await getUserProfileDetails(authUserId);
        console.log(profile);

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: profile
        });
    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

export const updateProfileDetails = async (req: Request, res: Response) => {
    try {
        const authUserId = req.headers.userid as string;

        if (!authUserId) {
            throw new AppError("Unauthorized", 401);
        }

        const {
            fullName,
            bio = "",
            skills = [],
            experience = 0,
            serviceCategory = [],
        } = req.body;

        if (!fullName) {
            throw new AppError("Please enter your full name", 400);
        }

        const updatedProfile = await updateProfileDetailsService({
            authUserId,
            fullName,
            bio,
            skills,
            experience,
            serviceCategory,
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const becomeWorker = async (req: Request, res: Response) => {
    try {
        //fetch data from req.body;
        const { address, serviceCategory, experience, skills, bio, phone, adhaarCardNumber, panCardNumber, citizenShip, nativeLanguages, age } = req.body;
        const profileImage = req.files?.profileImage as UploadedFile;

        // Gateway forwards the decoded user ID as the plain string header "userid"
        const authUserId = req.headers["userid"] as string;

        if (!authUserId || !address || !serviceCategory || !experience || !skills || !bio || !phone || !adhaarCardNumber || !panCardNumber || !citizenShip || !age || !nativeLanguages) {
            throw new AppError("Please enter all the fields", 400);
        }
        if (!profileImage) {
            throw new AppError("Please provide a profile picture", 400);
        }

        const workerProfile = await becomeWorkerService({ address, serviceCategory, experience, skills, bio, phone, adhaarCardNumber, panCardNumber, citizenShip, nativeLanguages, age, authUserId, profileImage });
        res.status(200).json({
            success: true,
            message: "Successfully applied for worker",
            data: workerProfile,
        });

    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }

}
