import express from "express";
import { sendEmailController, signUpController } from "../controllers/auth.controller";
const router = express.Router();

router.post("/send-email-auth",sendEmailController);
router.post("/signUp",signUpController);

export default router;