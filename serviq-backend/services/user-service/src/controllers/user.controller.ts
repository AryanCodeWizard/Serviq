import { Request, Response } from "express"
import { AppError } from "../utils/appError";
import { createUserProfileService } from "../services/profile.service"

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