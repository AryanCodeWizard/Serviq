import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose";
import { AppError } from "../utils/appError";
import { UploadedFile } from "express-fileupload";
import { createUserProfileService, getUserProfileDetails, updateProfileDetailsService, becomeWorkerService, addressUpdateService } from "../services/profile.service"
import { getAllWorkersForVerificationService, getAvailableWorkersByCategoryService, becomeAdminService, getSingleWorkerForVerificationService, wokerVerficationService, workerRejectVerificationService } from "../services/profileAdmin.service"
import User from "../models/user.model";

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
            message: "User Profile Created Successfully",
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

export const addressUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authUserId = req.headers["userid"] as string;
        if (!authUserId) throw new AppError("Unable to fetch user Id", 400);

        const { address } = req.body;
        if (!address) throw new AppError("Please provide address", 400);

        const updateAddress = await addressUpdateService({ address, authUserId });
        console.log(updateAddress)
        res.status(200).json({
            success: true,
            message: "Address Successfully Updated",
            data: updateAddress
        })

    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export const getAllWorkersForVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUserId = req.headers["userid"] as string;
        if (!authUserId) throw new AppError("Unable to fetch user Id", 400);

        const status = req.query.status as string;
        const verified = await getAllWorkersForVerificationService(authUserId, status);
        res.status(200).json({
            success: true,
            message: "Here is the list of all workers",
            data: verified
        })

    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export const getSingleWorkerForVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUserId = req.headers["userid"] as string;
        if (!authUserId) throw new AppError("Unable to fetch user Id", 400);

        const workerId = req.params.id as string;
        if (!workerId) throw new AppError("Worker ID is required", 400);

        const worker = await getSingleWorkerForVerificationService(authUserId, workerId);
        res.status(200).json({
            success: true,
            message: "Worker verification details fetched successfully",
            data: worker
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

export const becomeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUserId = req.headers["userid"] as string;
        if (!authUserId) throw new AppError("Unable to fetch user Id", 400);

        const { webSecret } = req.body;
        if (!webSecret) {
            throw new AppError("Unauthorized secret key", 403);
        }

        if (webSecret !== process.env.WEB_ADMIN_SECRET) {
            throw new AppError("Secret not matched, Unauthorised user", 403);
        }

        const admin = await becomeAdminService(authUserId);

        res.status(200).json({
            success: true,
            message: "You are successfully registered as admin",
            data: admin
        })


    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }

}

export const wokerVerfication = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authUserIdforRole = req.headers["userid"] as string;
        if (!authUserIdforRole) throw new AppError("Unable to fetch user Id", 400);
        console.log(authUserIdforRole);

        // also add sceret verication below
        

        const userDetails = await User.findOne({authUserId:authUserIdforRole});

        if(userDetails?.role!=='Admin'){
            throw new AppError("Unauthorised Access",403);
        }
       

        const authUserId = req.params.id as string;


        const updatedDetails = await wokerVerficationService(authUserId);
        console.log(updatedDetails);
        

        res.status(200).json({
            success: true,
            message:"Worker successfully verifed",
            data: updatedDetails
        })


    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export const wokerVerficationReject = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authUserIdforRole = req.headers["userid"] as string;
        if (!authUserIdforRole) throw new AppError("Unable to fetch user Id", 400);
        console.log(authUserIdforRole);

         // also add sceret verication below
        

        const userDetails = await User.findOne({authUserId:authUserIdforRole});

        if(userDetails?.role!=='Admin'){
            throw new AppError("Unauthorised Access",403);
        }
       

        const authUserId = req.params.id as string;


        const updatedDetails = await workerRejectVerificationService(authUserId);
        

        res.status(200).json({
            success: true,
            message:"Worker verification rejected successfully",
            data: updatedDetails
        })


    }
    catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export const getWorkersByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const serviceCategory = req.query.serviceCategory as string | undefined;
        const workers = await getAvailableWorkersByCategoryService(serviceCategory);

        res.status(200).json({
            success: true,
            message: "Workers fetched successfully",
            data: workers,
        });
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const getWorkerDeatails = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.body?.userId || (req.query?.userId as string) || req.params?.id;

    if(!userId){
        throw new AppError("Worker not found", 404);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(userId);
    const workerDetails = await User.findOne({
        $or: [
            { authUserId: userId },
            ...(isObjectId ? [{ _id: userId }] : [])
        ]
    });
    if(!workerDetails){
        throw new AppError("Worker not found", 404);
    }

    res.status(200).json({
        success: true,
        message:"Worker details fetched successfully",
        data: workerDetails
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