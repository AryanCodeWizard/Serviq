"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.logoutController = exports.updatePasswordController = exports.resetPasswordController = exports.forgotPasswordVerifyOtpController = exports.forgotPasswordController = exports.loginController = exports.signUpController = exports.sendEmailController = void 0;
const appError_1 = require("../utils/appError");
const otp_service_1 = require("../services/otp.service");
const auth_service_1 = require("../services/auth.service");
const auth_service_2 = require("../services/auth.service");
const password_service_1 = require("../services/password.service");
const redis_config_1 = require("../config/redis.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if (!fullName || !email || !password) {
            throw new appError_1.AppError("Please fill all the Inputs Field", 400);
        }
        if (password.length < 8) {
            throw new appError_1.AppError("Password should be atleast 8 charcters long", 422);
        }
        if (password !== confirmPassword) {
            throw new appError_1.AppError("Password and Confirm Password should be same", 422);
        }
        //service call
        const newOtp = yield (0, otp_service_1.sendEmailService)({ fullName, email });
        res.status(200).json({
            success: true,
            message: "Otp send successfully",
            // data: newOtp
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.sendEmailController = sendEmailController;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetch data from request body
        const { fullName, email, password, confirmPassword, otp } = req.body;
        if (!fullName || !email || !password || !otp) {
            throw new appError_1.AppError("Please fill all the Inputs Field something is missing", 400);
        }
        if (!otp) {
            throw new appError_1.AppError("Please provide otp", 400);
        }
        if (otp.length !== 4) {
            throw new appError_1.AppError("Otp should be 4 digit", 400);
        }
        if (password.length < 8) {
            throw new appError_1.AppError("Password should be atleast 8 charcters long", 422);
        }
        // if (password !== confirmPassword) {
        //     throw new AppError("Password and Confirm Password should be same", 422);
        // }
        //call service to create user [SIGNUP];
        const newUser = yield (0, auth_service_1.signUpService)({ fullName, email, password, otp });
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true, // Not accessible via JS
            sameSite: "lax", // Required for cross-port localhost
        };
        res.cookie("token", newUser.accessToken, options).status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.signUpController = signUpController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new appError_1.AppError("Please provide email and password", 400);
        }
        const client = (0, redis_config_1.getRedisClient)();
        //fetch userIp address
        const clientIpAddress = req.ip;
        const key = `${clientIpAddress}:request_count`;
        const requestCount = yield client.incr(key);
        if (requestCount == 1) {
            yield client.expire(key, 60);
        }
        if (requestCount > 10) {
            throw new appError_1.AppError("Too many request try after some time", 429);
        }
        //call service to login user
        const user = yield (0, auth_service_2.loginService)({ email, password });
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly: true, // Not accessible via JS
            sameSite: "lax", // Required for cross-port localhost
        };
        res.cookie("token", user.accessToken, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.loginController = loginController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetch data from request body
        const { email } = req.body;
        //check if email is provided
        if (!email) {
            throw new appError_1.AppError("Please provide email", 400);
        }
        //call service to send reset password link
        const resetPasswordServiceCall = yield (0, password_service_1.forgotPasswordService)({ email });
        res.status(200).json({
            success: true,
            message: "Reset password OTP sent successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.forgotPasswordController = forgotPasswordController;
const forgotPasswordVerifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetch data from request body
        const { email, otp } = req.body;
        //check if email and otp is provided
        if (!email || !otp) {
            throw new appError_1.AppError("Please provide email and otp", 400);
        }
        if (otp.length !== 4) {
            throw new appError_1.AppError("Otp should be 4 digit", 400);
        }
        //call service to verify otp
        const verifyOtpResult = yield (0, password_service_1.verifyOtpServiceCall)({ email, otp });
        console.log("verifyOtpResult", verifyOtpResult);
        res.status(200).json({
            success: true,
            message: "Otp verified successfully",
            data: verifyOtpResult
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.forgotPasswordVerifyOtpController = forgotPasswordVerifyOtpController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //fetch data from request body
        const { newPassword, confirmPassword, token } = req.body;
        //check if email and new password is provided
        if (!newPassword || !confirmPassword) {
            throw new appError_1.AppError("Please provide new password, confirm new password", 400);
        }
        if (!token) {
            throw new appError_1.AppError("Please provide token or something went wrong while fetching the token", 400);
        }
        if (newPassword.length < 8) {
            throw new appError_1.AppError("New password should be atleast 8 charcters long", 422);
        }
        if (newPassword !== confirmPassword) {
            throw new appError_1.AppError("New password and Confirm new password should be same", 422);
        }
        //call service to reset password
        const resetPasswordResult = yield (0, password_service_1.resetPasswordService)({ newPassword, token });
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
            data: resetPasswordResult
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.resetPasswordController = resetPasswordController;
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("User header data: ", req.headers.userid);
        const userIdHeader = req.headers.userid;
        if (!userIdHeader || Array.isArray(userIdHeader)) {
            throw new appError_1.AppError("Unable to fetch userId from header token", 404);
        }
        const userId = userIdHeader;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new appError_1.AppError("Please provide oldPassword and newPassword", 400);
        }
        if (newPassword.length < 8) {
            throw new appError_1.AppError("New password should be atleast 8 charcters long", 422);
        }
        if (newPassword !== confirmPassword) {
            throw new appError_1.AppError("New password and Confirm new password should be same", 422);
        }
        const updatePasswordResult = yield (0, password_service_1.updatePasswordService)({ userId, oldPassword, newPassword });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: updatePasswordResult
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.updatePasswordController = updatePasswordController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Blacklist the access token from Authorization header if present
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
                    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
                    if (ttl > 0) {
                        const client = (0, redis_config_1.getRedisClient)();
                        yield client.set(`blacklisted_token:${token}`, "1", { EX: ttl });
                    }
                }
            }
            catch (_) {
                // Token invalid or already expired — silently continue
            }
        }
        // Clear the HTTP-only cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});
exports.logoutController = logoutController;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = req.params.role;
        const { webRoleToken, userId } = req.body;
        if (!role || !webRoleToken || !userId) {
            throw new appError_1.AppError("Something went wrong", 400);
        }
        if (webRoleToken !== process.env.WEB_ADMIN_SECRET) {
            throw new appError_1.AppError("Unauthorized secret key", 403);
        }
        const updatedUser = yield (0, auth_service_2.updateUserRoleService)({ role, userId });
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Sever Error"
        });
    }
});
exports.updateUserRole = updateUserRole;
