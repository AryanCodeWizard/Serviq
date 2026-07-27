"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.createBooking = void 0;
const booking_service_1 = require("../services/booking.service");
const appError_1 = require("../utils/appError");
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerAuthId, workerAuthId, service, bookingDate, bookingTime, customerAddress, customerPhoneNumber, workerPhoneNumber, problemDescription, price } = req.body;
        console.log(req.body);
        // 1. Check Mandatory Fields
        if (!customerAuthId || !workerAuthId || !service || !bookingDate || !bookingTime || !customerAddress || !customerPhoneNumber || !price || !workerPhoneNumber) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }
        // 2. Group data safely for your database
        const cleanBookingData = {
            customerAuthId,
            workerAuthId,
            service: Array.isArray(service) ? service : [service],
            bookingDate,
            bookingTime,
            customerAddress,
            customerPhoneNumber,
            price,
            workerPhoneNumber: workerPhoneNumber || "",
            problemDescription: problemDescription || "",
            otp: req.body.otp,
        };
        const createdBooking = yield (0, booking_service_1.createBookingService)(cleanBookingData);
        return res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            data: createdBooking
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error."
        });
    }
});
exports.createBooking = createBooking;
const getAllBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerAuthId = req.headers["userid"];
        if (!workerAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        const getAllBookingsCall = yield (0, booking_service_1.getAllBookingsService)(workerAuthId);
        res.status(200).json({
            success: true,
            message: "All booking fecthed successfully",
            data: getAllBookingsCall
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error."
        });
    }
});
exports.getAllBookings = getAllBookings;
