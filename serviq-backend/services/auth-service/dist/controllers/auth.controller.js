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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailController = void 0;
const appError_1 = require("../utils/appError");
const auth_service_1 = require("../services/auth.service");
const sendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, role } = req.body;
        if (!fullName || !email || !password || !role) {
            throw new appError_1.AppError("Please fill all the Inputs Field", 400);
        }
        if (password.length < 8) {
            throw new appError_1.AppError("Password should be atleast 8 charcters long", 422);
        }
        //service call
        const newOtp = yield (0, auth_service_1.sendEmailService)({ fullName, email, password, role });
        res.status(200).json({
            success: true,
            message: "Otp send successfully",
            data: newOtp
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
