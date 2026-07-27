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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookingsService = exports.createBookingService = void 0;
const booking_model_1 = require("../model/booking.model");
const appError_1 = require("../utils/appError");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const createBookingService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { customerAuthId, workerAuthId, service, bookingDate, bookingTime, customerAddress, customerPhoneNumber, price, problemDescription, workerPhoneNumber } = data;
    const sameBookingCheck = yield booking_model_1.Booking.find({
        customerAuthId: customerAuthId,
        workerAuthId: workerAuthId,
        service: { $all: service },
        bookingStatus: "Pending"
    });
    if (sameBookingCheck.length > 0) {
        throw new appError_1.AppError("Booking for same service already booked", 400);
    }
    // Get worker details from user service
    const userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost:6000").replace(/\/$/, "");
    const endpoint = userServiceUrl.includes("3000")
        ? `${userServiceUrl}/api/v1/users/getworker-details`
        : `${userServiceUrl}/getworker-details`;
    let workerResponse;
    try {
        workerResponse = yield axios_1.default.get(endpoint, {
            params: { userId: workerAuthId }
        });
    }
    catch (err) {
        console.error("Axios Error Details:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        const status = ((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) || 500;
        const message = ((_d = (_c = err.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Failed to fetch worker details or worker service unavailable";
        throw new appError_1.AppError(message, status);
    }
    const worker = (_e = workerResponse === null || workerResponse === void 0 ? void 0 : workerResponse.data) === null || _e === void 0 ? void 0 : _e.data;
    if (!worker) {
        throw new appError_1.AppError("Worker not found", 404);
    }
    // Verify worker eligibility
    if (!worker.isVerifiedWorker) {
        throw new appError_1.AppError("Worker is not verified", 403);
    }
    if (worker.isBlocked) {
        throw new appError_1.AppError("Worker is blocked", 403);
    }
    if (!worker.isAvailable) {
        throw new appError_1.AppError("Worker is not available to serve", 403);
    }
    if (worker.workerApplicationStatus !== "Approved") {
        throw new appError_1.AppError("Worker application status is not approved", 403);
    }
    // Generate 4-digit OTP for booking verification
    const otp = data.otp || crypto_1.default.randomInt(1000, 10000).toString();
    // Generate new booking
    const newBooking = yield booking_model_1.Booking.create({
        customerAuthId,
        workerAuthId,
        service,
        bookingDate,
        bookingTime,
        customerAddress,
        customerPhoneNumber,
        workerPhoneNumber,
        problemDescription,
        price,
        otp,
    });
    return newBooking;
});
exports.createBookingService = createBookingService;
const getAllBookingsService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const workerAuthId = data;
    //check role woker validation
    const allBooking = yield booking_model_1.Booking.find({ workerAuthId: workerAuthId, bookingStatus: "Pending" });
    return allBooking;
});
exports.getAllBookingsService = getAllBookingsService;
