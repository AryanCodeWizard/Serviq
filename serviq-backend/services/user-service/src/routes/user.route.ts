import express from "express";
const router = express.Router();
import {createUserProfile, getProfileDetails,updateProfileDetails ,becomeWorker} from '../controllers/user.controller'


router.post("/create-profile",createUserProfile)
router.get("/get-profile-details",getProfileDetails);
router.put("/update-profile-details",updateProfileDetails );
router.post("/become-worker",becomeWorker)

export default router;