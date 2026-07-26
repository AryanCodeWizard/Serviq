import User from "../models/user.model";
import { AppError } from "../utils/appError";
import axios from 'axios'
export const getAllWorkersForVerificationService = async(data:string)=>{
    const authUserId=data;
    const checkIfUserExist = await User.findOne({authUserId});
    if(!checkIfUserExist){
        throw new AppError("User not registered with us",404);
    }

    if(checkIfUserExist?.role !== 'Admin'){
        throw new AppError("Unauthorized user",404);
    }

    const fetchAllWorkers = await User.find({role:"Worker",workerApplicationStatus:"Pending"});
    return fetchAllWorkers

}

export const becomeAdminService = async(data:string)=>{
    const authUserId=data;
    const checkIfUserExist = await User.findOne({authUserId});
    if(!checkIfUserExist){
        throw new AppError("User not registered with us",404);
    }
    const updatedUser = await User.findOneAndUpdate({authUserId:authUserId},{
        role:"Admin"
    }, { returnDocument: "after" });

    const role="Admin";
    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001";

    const updateAuthServiceRole = await axios.put(`${authServiceUrl}/update-user-role/${role}`,{
        userId:authUserId,
        webRoleToken: process.env.WEB_ADMIN_SECRET
    });
    console.log(updateAuthServiceRole.data);
    return updatedUser;
}
