import express from 'express';
const router = express.Router();
import {createBooking,getAllBookings,getWorkerBookings,getCustomerBookings,getBookingDetails,updateBookingStatus} from '../controllers/booking.controller'

router.post("/create-booking",createBooking)
router.get("/getAll-booking",getAllBookings)
router.get("/worker-bookings",getWorkerBookings)
router.get("/customer-bookings",getCustomerBookings)
router.get("/:bookingId",getBookingDetails)
router.patch("/:bookingId/status",updateBookingStatus)

export default router