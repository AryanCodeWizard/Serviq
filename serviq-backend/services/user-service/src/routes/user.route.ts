import express from "express";
const router = express.Router();
import {createUserProfile, getProfileDetails,updateProfileDetails ,becomeWorker,addressUpdateController,getAllWorkersForVerification,getSingleWorkerForVerification,becomeAdmin} from '../controllers/user.controller'


router.post("/create-profile",createUserProfile)
router.get("/get-profile-details",getProfileDetails);
router.put("/update-profile-details",updateProfileDetails );
router.post("/become-worker",becomeWorker);
router.put("/update-address",addressUpdateController)
router.get("/getallwoker-verification",getAllWorkersForVerification);
router.get("/getallworker-verification",getAllWorkersForVerification);
router.get("/getworker-verification/:id",getSingleWorkerForVerification);
router.get("/getwoker-verification/:id",getSingleWorkerForVerification);
router.post("/become-admin",becomeAdmin);

export default router;