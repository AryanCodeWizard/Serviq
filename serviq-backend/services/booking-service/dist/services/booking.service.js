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
exports.updateBookingStatusService = exports.getBookingDetailsService = exports.getCustomerBookingsService = exports.getWorkerBookingsService = exports.getAllBookingsService = exports.createBookingService = void 0;
const booking_model_1 = require("../model/booking.model");
const appError_1 = require("../utils/appError");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const bookingMail_producer_1 = require("../producers/bookingMail.producer");
const resolveUserServiceEndpoint = () => {
    const userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost:6000").replace(/\/$/, "");
    return userServiceUrl.includes("3000")
        ? `${userServiceUrl}/api/v1/users/getworker-details`
        : `${userServiceUrl}/getworker-details`;
};
const resolveCustomerProfileEndpoint = () => {
    const userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost:6000").replace(/\/$/, "");
    return userServiceUrl.includes("3000")
        ? `${userServiceUrl}/api/v1/users/get-profile-details`
        : `${userServiceUrl}/get-profile-details`;
};
const buildBookingMailBody = (title, recipientName, booking) => {
    const serviceList = Array.isArray(booking.service) ? booking.service.join(", ") : booking.service;
    return `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">${title}</h2>
            <p>Hi ${recipientName},</p>
            <p>Your booking has been created successfully.</p>
            <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
                <p><strong>Service:</strong> ${serviceList}</p>
                <p><strong>Date:</strong> ${booking.bookingDate}</p>
                <p><strong>Time:</strong> ${booking.bookingTime}</p>
                <p><strong>Status:</strong> ${booking.bookingStatus}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
            </div>
            <p style="margin-top: 16px;">We’ll keep you updated as the booking moves forward.</p>
        </div>
    `;
};
const dispatchBookingEmails = (booking) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const [customerResult, workerResult] = yield Promise.allSettled([
            axios_1.default.get(resolveCustomerProfileEndpoint(), {
                headers: { userid: booking.customerAuthId },
            }),
            axios_1.default.get(resolveUserServiceEndpoint(), {
                params: { userId: booking.workerAuthId },
            }),
        ]);
        const mailFrom = process.env.MAIL_FROM || "noreply@serviq.com";
        if (customerResult.status === "fulfilled") {
            const customer = (_b = (_a = customerResult.value) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.data;
            if (customer === null || customer === void 0 ? void 0 : customer.email) {
                (0, bookingMail_producer_1.sendBookingMailMessage)({
                    email: customer.email,
                    from: mailFrom,
                    subject: "Booking confirmed",
                    body: buildBookingMailBody(customer.fullName || "Customer", customer.fullName || "Customer", booking),
                });
            }
        }
        if (workerResult.status === "fulfilled") {
            const worker = (_d = (_c = workerResult.value) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.data;
            if (worker === null || worker === void 0 ? void 0 : worker.email) {
                (0, bookingMail_producer_1.sendBookingMailMessage)({
                    email: worker.email,
                    from: mailFrom,
                    subject: "New booking assigned",
                    body: buildBookingMailBody(worker.fullName || "Worker", worker.fullName || "Worker", booking),
                });
            }
        }
    }
    catch (error) {
        console.error("Booking email dispatch failed:", error);
    }
});
const validateBookingOwnership = (booking, actorAuthId, actorRole) => {
    if (actorRole === "Worker" && booking.workerAuthId !== actorAuthId) {
        throw new appError_1.AppError("You are not allowed to access this booking", 403);
    }
    if (actorRole === "User" && booking.customerAuthId !== actorAuthId) {
        throw new appError_1.AppError("You are not allowed to access this booking", 403);
    }
};
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
    let workerResponse;
    try {
        workerResponse = yield axios_1.default.get(resolveUserServiceEndpoint(), {
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
    void dispatchBookingEmails(newBooking);
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
const getWorkerBookingsService = (workerAuthId, bookingStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { workerAuthId };
    if (bookingStatus && bookingStatus !== "all") {
        query.bookingStatus = bookingStatus;
    }
    return booking_model_1.Booking.find(query).sort({ createdAt: -1 });
});
exports.getWorkerBookingsService = getWorkerBookingsService;
const getCustomerBookingsService = (customerAuthId, bookingStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { customerAuthId };
    if (bookingStatus && bookingStatus !== "all") {
        query.bookingStatus = bookingStatus;
    }
    return booking_model_1.Booking.find(query).sort({ createdAt: -1 });
});
exports.getCustomerBookingsService = getCustomerBookingsService;
const getBookingDetailsService = (bookingId, actorAuthId, actorRole) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new appError_1.AppError("Booking not found", 404);
    }
    validateBookingOwnership(booking, actorAuthId, actorRole);
    return booking;
});
exports.getBookingDetailsService = getBookingDetailsService;
const updateBookingStatusService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, actorAuthId, actorRole, bookingStatus, rejectReason } = data;
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new appError_1.AppError("Booking not found", 404);
    }
    validateBookingOwnership(booking, actorAuthId, actorRole);
    if (actorRole === "User") {
        if (bookingStatus !== "Cancelled") {
            throw new appError_1.AppError("Customers can only cancel bookings", 403);
        }
        if (["Cancelled", "Completed"].includes(booking.bookingStatus || "")) {
            throw new appError_1.AppError("Booking cannot be cancelled in its current state", 400);
        }
        if (booking.bookingStatus === "In Progress") {
            throw new appError_1.AppError("In progress bookings cannot be cancelled by customers", 400);
        }
        booking.bookingStatus = "Cancelled";
        booking.rejectReason = rejectReason || "Cancelled by customer";
    }
    if (actorRole === "Worker") {
        switch (bookingStatus) {
            case "Accepted":
                if (booking.bookingStatus !== "Pending") {
                    throw new appError_1.AppError("Only pending bookings can be accepted", 400);
                }
                booking.bookingStatus = "Accepted";
                booking.rejectReason = "";
                break;
            case "In Progress":
                if (booking.bookingStatus !== "Accepted") {
                    throw new appError_1.AppError("Only accepted bookings can move to in progress", 400);
                }
                booking.bookingStatus = "In Progress";
                booking.rejectReason = "";
                break;
            case "Completed":
                if (booking.bookingStatus !== "In Progress") {
                    throw new appError_1.AppError("Only in progress bookings can be completed", 400);
                }
                booking.bookingStatus = "Completed";
                booking.rejectReason = "";
                break;
            case "Cancelled":
                if (!["Pending", "Accepted"].includes(booking.bookingStatus || "")) {
                    throw new appError_1.AppError("Only pending or accepted bookings can be cancelled", 400);
                }
                booking.bookingStatus = "Cancelled";
                booking.rejectReason = rejectReason || "Cancelled by worker";
                break;
            default:
                throw new appError_1.AppError("Invalid booking status update", 400);
        }
    }
    yield booking.save();
    return booking;
});
exports.updateBookingStatusService = updateBookingStatusService;
