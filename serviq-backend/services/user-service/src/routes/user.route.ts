import express from "express";
const router = express.Router();
import {createUserProfile} from '../controllers/user.controller'


router.post("/create-profile",createUserProfile)
export default router;