import type { AxiosRequestConfig } from "axios";
import api from "./axios";
import type { ApiResponse } from "../types/auth";

export interface UserProfile {
    _id?: string;
    authUserId: string;
    fullName: string;
    email: string;
    role: "User" | "Worker" | "Admin";
    phone?: string;
    profileImage?: string;
    bio?: string;
    skills?: string[];
    experience?: number;
    serviceCategory?: string[];
    address?: string;
    isVerifiedWorker?: boolean;
    workerApplicationStatus?: "Pending" | "Approved" | "Rejected";
    averageRating?: number;
    totalReviews?: number;
    totalJobsCompleted?: number;
    isAvailable?: boolean;
}

export const getProfileDetailsAPI = (config?: AxiosRequestConfig) => {
    return api.get<ApiResponse<UserProfile>>("/users/get-profile-details", config);
};

export interface CreateProfilePayload {
    authUserId: string;
    email: string;
    fullName: string;
    profileImage: string;
    role: "User" | "Worker" | "Admin";
}

export const createProfileAPI = (data: CreateProfilePayload, config?: AxiosRequestConfig) => {
    return api.post<ApiResponse<UserProfile>>("/users/create-profile", data, config);
};

export const getWorkerDetailsAPI = (userId: string, config?: AxiosRequestConfig) => {
    return api.get<ApiResponse<UserProfile>>("/users/getworker-details", {
        ...config,
        params: { userId },
    });
};