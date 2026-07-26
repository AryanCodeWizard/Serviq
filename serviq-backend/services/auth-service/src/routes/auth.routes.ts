import express from "express";
import { loginController, sendEmailController, signUpController, updateUserRole,forgotPasswordController, forgotPasswordVerifyOtpController, resetPasswordController, updatePasswordController, logoutController } from "../controllers/auth.controller";
const router = express.Router();

router.post("/send-email-auth",sendEmailController);
router.post("/signUp",signUpController);
router.post("/login",loginController);
router.post("/forgot-password",forgotPasswordController);
router.post("/forgot-password/verify-otp",forgotPasswordVerifyOtpController);
router.post("/reset-password",resetPasswordController);
router.patch("/update-password",updatePasswordController);
router.post("/logout",logoutController);
router.put("/update-user-role/:role",updateUserRole)

export default router;