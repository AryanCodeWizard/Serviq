"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const booking_controller_1 = require("../controllers/booking.controller");
router.post("/create-booking", booking_controller_1.createBooking);
router.get("/getAll-booking", booking_controller_1.getAllBookings);
router.get("/worker-bookings", booking_controller_1.getWorkerBookings);
router.get("/customer-bookings", booking_controller_1.getCustomerBookings);
router.get("/:bookingId", booking_controller_1.getBookingDetails);
router.patch("/:bookingId/status", booking_controller_1.updateBookingStatus);
exports.default = router;
