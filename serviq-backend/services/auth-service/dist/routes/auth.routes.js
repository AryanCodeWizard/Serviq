"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/send-email-auth", auth_controller_1.sendEmailController);
router.post("/signUp", auth_controller_1.signUpController);
router.post("/login", auth_controller_1.loginController);
router.post("/forgot-password", auth_controller_1.forgotPasswordController);
router.post("/forgot-password/verify-otp", auth_controller_1.forgotPasswordVerifyOtpController);
router.post("/reset-password", auth_controller_1.resetPasswordController);
router.patch("/update-password", auth_controller_1.updatePasswordController);
router.post("/logout", auth_controller_1.logoutController);
router.put("/update-user-role/:role", auth_controller_1.updateUserRole);
exports.default = router;
