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
exports.updateUserRoleService = exports.loginService = exports.signUpService = void 0;
const user_model_1 = require("../model/user.model");
const appError_1 = require("../utils/appError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../config/redis.config");
const profileProducer_1 = require("../producers/profileProducer");
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { fullName, email, password, otp } = data;
    //check if user already exists
    const existingUser = yield user_model_1.User.findOne({ email: email });
    if (existingUser) {
        throw new appError_1.AppError("User already exists with this email", 409);
    }
    //find latest otp for this email
    // const latestOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 }).exec();
    const client = (0, redis_config_1.getRedisClient)();
    const latestOtp = yield client.get(`signup_otp:${email}`);
    if (!latestOtp || latestOtp !== otp) {
        throw new appError_1.AppError("Invalid OTP or OTP has expired", 400);
    }
    //HASH the PASSWORD
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    //create new user
    const newUser = yield user_model_1.User.create({
        fullName: fullName,
        email: email,
        role: "User",
        password: hashedPassword,
    });
    const profileImage = yield `https://api.dicebear.com/10.x/initials/svg?seed=${fullName}`;
    //send message to user-service
    (0, profileProducer_1.sendProfileMaessage)({ fullName, email, profileImage, authUserId: newUser._id });
    const payload = {
        email: email,
        userId: newUser._id,
        role: "User"
    };
    const accessToken = yield jsonwebtoken_1.default.sign(payload, (_a = process.env.ACCESS_TOKEN_JWT_SECRET) !== null && _a !== void 0 ? _a : "default_secret", { expiresIn: "10min" });
    const refreshToken = yield jsonwebtoken_1.default.sign(payload, (_b = process.env.REFRESH_TOKEN_JWT_SECRET) !== null && _b !== void 0 ? _b : "default_secret", { expiresIn: "7d" });
    // const userObj=  JSON.parse(JSON.stringify(newUser));  // Convert Mongoose document to plain object
    const userObj = newUser.toObject(); // Convert Mongoose document to plain object
    userObj.accessToken = accessToken; // Add the token to the user object
    userObj.refreshToken = refreshToken;
    userObj.password = undefined; // Remove the password field from the user object
    return userObj;
});
exports.signUpService = signUpService;
const loginService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = data;
    //check if user exists
    const existingUser = yield user_model_1.User.findOne({ email: email });
    if (!existingUser) {
        throw new appError_1.AppError("User does not exist with this email", 404);
    }
    //compare password
    const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new appError_1.AppError("Invalid password", 401);
    }
    const payload = {
        email: email,
        role: existingUser.role,
        userId: existingUser._id
    }; // Log the secret key for debugging
    const accessToken = yield jsonwebtoken_1.default.sign(payload, (_a = process.env.ACCESS_TOKEN_JWT_SECRET) !== null && _a !== void 0 ? _a : "default_secret", { expiresIn: "10min" });
    const refreshToken = yield jsonwebtoken_1.default.sign(payload, (_b = process.env.REFRESH_TOKEN_JWT_SECRET) !== null && _b !== void 0 ? _b : "default_secret", { expiresIn: "7d" });
    const userObj = existingUser.toObject();
    userObj.accessToken = accessToken;
    userObj.refreshToken = refreshToken;
    userObj.password = undefined;
    return userObj;
});
exports.loginService = loginService;
const updateUserRoleService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = data;
    const userDetails = yield user_model_1.User.findById(userId);
    if (!userDetails) {
        throw new appError_1.AppError("User details not found", 404);
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
        role: role
    }, { returnDocument: "after" });
    return updatedUser;
});
exports.updateUserRoleService = updateUserRoleService;
