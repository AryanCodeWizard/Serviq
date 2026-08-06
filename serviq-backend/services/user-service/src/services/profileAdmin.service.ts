import User from "../models/user.model";
import { AppError } from "../utils/appError";
import axios from 'axios';
import mongoose from 'mongoose';

export const getAllWorkersForVerificationService = async(data: string, status?: string)=>{
    const authUserId = data;
    const checkIfUserExist = await User.findOne({authUserId});
    if(!checkIfUserExist){
        throw new AppError("User not registered with us",404);
    }

    if(checkIfUserExist?.role !== 'Admin'){
        throw new AppError("Unauthorized user",403);
    }

    const filter: any = { role: "Worker" };
    if (status && status !== "All") {
        filter.workerApplicationStatus = status;
    }

    const fetchAllWorkers = await User.find(filter);
    return fetchAllWorkers;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeCategoryFilter = (serviceCategory: string) => {
    const normalized = serviceCategory.trim().toLowerCase();

    if (/deep\s*clean|cleaning/.test(normalized)) {
        return /cleaning/i;
    }

    if (/\bac\b|air\s*conditioning|ac\s*repair/.test(normalized)) {
        return /ac|air\s*conditioning|airconditioning/i;
    }

    if (/beauty|spa/.test(normalized)) {
        return /beauty|spa/i;
    }

    if (/plumbing/.test(normalized)) {
        return /plumbing/i;
    }

    if (/electrical/.test(normalized)) {
        return /electrical/i;
    }

    if (/carpentry/.test(normalized)) {
        return /carpentry/i;
    }

    return new RegExp(`^${escapeRegExp(normalized)}$`, "i");
};

export const getAvailableWorkersByCategoryService = async(serviceCategory?: string) => {
    const filter: any = {
        role: "Worker",
        isVerifiedWorker: true,
        workerApplicationStatus: "Approved",
        isAvailable: true,
    };

    if (serviceCategory) {
        filter.serviceCategory = { $elemMatch: { $regex: normalizeCategoryFilter(serviceCategory) } };
    }

    const workers = await User.find(filter);
    return workers;
}

export const getSingleWorkerForVerificationService = async(adminAuthUserId: string, workerId: string) => {
    const checkIfUserExist = await User.findOne({ authUserId: adminAuthUserId });
    if (!checkIfUserExist) {
        throw new AppError("User not registered with us", 404);
    }

    if (checkIfUserExist?.role !== 'Admin') {
        throw new AppError("Unauthorized user", 403);
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(workerId);
    const worker = await User.findOne({
        $or: [
            ...(isObjectId ? [{ _id: workerId }] : []),
            { authUserId: workerId }
        ]
    });

    if (!worker) {
        throw new AppError("Worker profile not found", 404);
    }

    return worker;
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

export const wokerVerficationService = async(data:string) => {
    const authUserId = data;
    console.log("jfjnjfg",authUserId);

    const worker = await User.findOne({authUserId:authUserId});
    if(!worker){
        throw new AppError("Worker with this id not found",404);
    }

    if(worker?.workerApplicationStatus === "Approved"){
        throw new AppError("Worker status is already Approved",402);
    }

    const updateWorker = await User.findOneAndUpdate({authUserId:authUserId},{
        workerApplicationStatus:"Approved"
    },{returnDocument:"after"});

    return updateWorker;
}

export const workerRejectVerificationService = async (authUserId: string) => {
    const worker = await User.findOne({ authUserId });
    if (!worker) {
        throw new AppError("Worker with this ID not found", 404);
    }

    if (worker.workerApplicationStatus === "Rejected") {
        throw new AppError("Worker status is already Rejected", 400); 
    }

    const updatedWorker = await User.findOneAndUpdate(
        { authUserId },
        { workerApplicationStatus: "Rejected" },
        { new: true }
    );

    return updatedWorker;
};
