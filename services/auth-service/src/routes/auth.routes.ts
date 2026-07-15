import express from "express";
import { loginController, sendEmailController, signUpController } from "../controllers/auth.controller";
const router = express.Router();

router.post("/send-email-auth",sendEmailController);
router.post("/signUp",signUpController);
router.post("/login",loginController);

export default router;