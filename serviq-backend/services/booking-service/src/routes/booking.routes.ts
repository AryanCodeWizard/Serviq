import express from 'express';
const router = express.Router();
import {createBooking,getAllBookings} from '../controllers/booking.controller'

router.post("/create-booking",createBooking)
router.get("/getAll-booking",getAllBookings)

export default router