export type UserRole = "User" | "Worker" | "Admin";

export interface AuthUser {
    _id?: string;
    authUserId?: string;
    fullName: string;
    email: string;
    role: UserRole;
    phone?: string;
    profileImage?: string;
    bio?: string;
    address?: string;
    serviceCategory?: string[];
    skills?: string[];
    isVerifiedWorker?: boolean;
    workerApplicationStatus?: "Pending" | "Approved" | "Rejected";
    averageRating?: number;
    totalJobsCompleted?: number;
}

export interface AuthApiUser extends AuthUser {
    accessToken: string;
    refreshToken: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken?: string | null;
    user: AuthUser;
}

export type signUpPayload = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    otp?: string;
};

export type loginPayload = {
    email: string;
    password: string;
};

export type forgotPasswordPayload = {
    email: string;
};

export type forgotPasswordVerifyOTPPayload = {
    email: string;
    otp: string;
};

export type resetPasswordPayload = {
    newPassword: string;
    confirmPassword: string;
    token: string;
};

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}