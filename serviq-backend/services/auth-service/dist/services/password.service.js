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
exports.updatePasswordService = exports.resetPasswordService = exports.verifyOtpServiceCall = exports.forgotPasswordService = void 0;
const user_model_1 = require("../model/user.model");
const appError_1 = require("../utils/appError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const axios_1 = __importDefault(require("axios"));
const mail_template_1 = require("../templates/mail.template");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_config_1 = require("../config/redis.config");
const forgotPasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = data.email;
    //check if user exists with this email
    const existingUser = yield user_model_1.User.findOne({ email: email });
    if (!existingUser) {
        throw new appError_1.AppError("User does not exist with this email", 404);
    }
    // Example: 6-digit numeric otp
    const otp = otp_generator_1.default.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    //save the otp and expiry time in the user document
    // const newOtp = await Otp.create({
    //     email: email,
    //     otp: otp,
    // });
    //save otp to redis
    const client = (0, redis_config_1.getRedisClient)();
    const newOtp = yield client.set(`forgot_password_otp:${email}`, otp, { EX: 300 });
    const mailServiceBaseUrl = (_a = process.env.MAIL_SERVICE_URL) !== null && _a !== void 0 ? _a : "http://localhost:5001";
    const mailServiceCall = yield axios_1.default.post(`${mailServiceBaseUrl}/api/v1/send-mail`, {
        email: email,
        subject: "Your OTP for Password Reset",
        body: (0, mail_template_1.sendmailTemplate)(existingUser.fullName, otp),
        from: "noreply@kamwale.com"
    });
});
exports.forgotPasswordService = forgotPasswordService;
const verifyOtpServiceCall = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = data;
    //check if user exists with this email
    const existingUser = yield user_model_1.User.findOne({ email: email });
    if (!existingUser) {
        throw new appError_1.AppError("User does not exist with this email", 404);
    }
    // const latestOtp= await Otp.findOne({ email: email }).sort({ createdAt: -1 });
    const client = (0, redis_config_1.getRedisClient)();
    const latestOtp = yield client.get(`forgot_password_otp:${email}`);
    if (!latestOtp) {
        throw new appError_1.AppError("No OTP found for this email", 404);
    }
    if (otp.length !== 4) {
        throw new appError_1.AppError("Otp should be 4 digit", 400);
    }
    if (latestOtp !== otp) {
        throw new appError_1.AppError("Invalid OTP", 400);
    }
    // If OTP is valid, generate a token for password reset
    // You can use any method to generate a token, here we are using crypto
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: email }, {
        resetPasswordToken: token,
        resetPasswordExpiry: new Date(Date.now() + 3600000)
    }, { returnDocument: "after" }).select("-password"); // Exclude password field from the returned user
    if (!updatedUser) {
        throw new appError_1.AppError("Failed to update user with reset token", 500);
    }
    console.log("OTP verified successfully. Use the token to reset your password.");
    return updatedUser; // Return the updated user with reset token and expiry
});
exports.verifyOtpServiceCall = verifyOtpServiceCall;
const resetPasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, token } = data;
    // Find the user with the provided reset token and check if it's still valid
    const userDetails = yield user_model_1.User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: new Date() }
    });
    if (!userDetails) {
        throw new appError_1.AppError("Invalid or expired reset token", 400);
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    userDetails.password = hashedPassword;
    userDetails.resetPasswordToken = undefined;
    userDetails.resetPasswordExpiry = undefined;
    yield userDetails.save();
    return { message: "Password reset successfully" };
});
exports.resetPasswordService = resetPasswordService;
const updatePasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, oldPassword, newPassword } = data;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new appError_1.AppError("Old password is incorrect", 400);
    }
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
    user.password = hashedNewPassword;
    yield user.save();
    return { message: "Password updated successfully" };
});
exports.updatePasswordService = updatePasswordService;
