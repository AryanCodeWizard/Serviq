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
exports.updateBookingStatus = exports.getBookingDetails = exports.getCustomerBookings = exports.getWorkerBookings = exports.getAllBookings = exports.createBooking = void 0;
const booking_service_1 = require("../services/booking.service");
const appError_1 = require("../utils/appError");
const readHeaderValue = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerAuthId, workerAuthId, service, bookingDate, bookingTime, customerAddress, customerPhoneNumber, workerPhoneNumber, problemDescription, price } = req.body;
        const authUserId = readHeaderValue(req.headers["userid"]);
        const resolvedCustomerAuthId = authUserId || customerAuthId;
        // 1. Check Mandatory Fields
        if (!resolvedCustomerAuthId || !workerAuthId || !service || !bookingDate || !bookingTime || !customerAddress || !customerPhoneNumber || price === undefined || price === null || !workerPhoneNumber) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }
        // 2. Group data safely for your database
        const cleanBookingData = {
            customerAuthId: resolvedCustomerAuthId,
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
        const workerAuthId = readHeaderValue(req.headers["userid"]);
        if (!workerAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        const bookingStatus = req.query.status;
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
const getWorkerBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workerAuthId = readHeaderValue(req.headers["userid"]);
        if (!workerAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        const bookingStatus = req.query.status;
        const bookings = yield (0, booking_service_1.getWorkerBookingsService)(workerAuthId, bookingStatus);
        res.status(200).json({
            success: true,
            message: "Worker bookings fetched successfully",
            data: bookings,
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
});
exports.getWorkerBookings = getWorkerBookings;
const getCustomerBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerAuthId = readHeaderValue(req.headers["userid"]);
        if (!customerAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        const bookingStatus = req.query.status;
        const bookings = yield (0, booking_service_1.getCustomerBookingsService)(customerAuthId, bookingStatus);
        res.status(200).json({
            success: true,
            message: "Customer bookings fetched successfully",
            data: bookings,
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
});
exports.getCustomerBookings = getCustomerBookings;
const getBookingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = readHeaderValue(req.params.bookingId);
        const actorAuthId = readHeaderValue(req.headers["userid"]);
        const actorRole = readHeaderValue(req.headers["role"]);
        if (!bookingId)
            throw new appError_1.AppError("Booking id is required", 400);
        if (!actorAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        if (!actorRole)
            throw new appError_1.AppError("Unable to fetch user role", 400);
        const booking = yield (0, booking_service_1.getBookingDetailsService)(bookingId, actorAuthId, actorRole);
        res.status(200).json({
            success: true,
            message: "Booking details fetched successfully",
            data: booking,
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
});
exports.getBookingDetails = getBookingDetails;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = readHeaderValue(req.params.bookingId);
        const actorAuthId = readHeaderValue(req.headers["userid"]);
        const actorRole = readHeaderValue(req.headers["role"]);
        const { bookingStatus, rejectReason } = req.body;
        if (!bookingId)
            throw new appError_1.AppError("Booking id is required", 400);
        if (!actorAuthId)
            throw new appError_1.AppError("Unable to fetch user Id", 400);
        if (!actorRole)
            throw new appError_1.AppError("Unable to fetch user role", 400);
        if (!bookingStatus)
            throw new appError_1.AppError("Booking status is required", 400);
        const updatedBooking = yield (0, booking_service_1.updateBookingStatusService)({
            bookingId,
            actorAuthId,
            actorRole,
            bookingStatus,
            rejectReason,
        });
        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: updatedBooking,
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
});
exports.updateBookingStatus = updateBookingStatus;
