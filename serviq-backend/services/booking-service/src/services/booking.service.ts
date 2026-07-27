import { Booking, type IBookingData } from "../model/booking.model";
import { AppError } from "../utils/appError";
import axios from 'axios';
import crypto from 'crypto';

export const createBookingService = async (data: IBookingData) => {
    const { customerAuthId, workerAuthId, service, bookingDate, bookingTime, customerAddress, customerPhoneNumber, price, problemDescription, workerPhoneNumber } = data;

    const sameBookingCheck = await Booking.find({
        customerAuthId: customerAuthId,
        workerAuthId: workerAuthId,
        service: { $all: service },
        bookingStatus: "Pending"
    });
    if (sameBookingCheck.length > 0) {
        throw new AppError("Booking for same service already booked", 400);
    }

    // Get worker details from user service
    const userServiceUrl = (process.env.USER_SERVICE_URL || "http://localhost:6000").replace(/\/$/, "");
    const endpoint = userServiceUrl.includes("3000")
        ? `${userServiceUrl}/api/v1/users/getworker-details`
        : `${userServiceUrl}/getworker-details`;

    let workerResponse;
    try {
        workerResponse = await axios.get(endpoint, {
            params: { userId: workerAuthId }
        });
    } catch (err: any) {
        console.error("Axios Error Details:", err.response?.data || err.message);
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || "Failed to fetch worker details or worker service unavailable";
        throw new AppError(message, status);
    }


    const worker = workerResponse?.data?.data;
    if (!worker) {
        throw new AppError("Worker not found", 404);
    }

    // Verify worker eligibility
    if (!worker.isVerifiedWorker) {
        throw new AppError("Worker is not verified", 403);
    }
    if (worker.isBlocked) {
        throw new AppError("Worker is blocked", 403);
    }
    if (!worker.isAvailable) {
        throw new AppError("Worker is not available to serve", 403);
    }
    if (worker.workerApplicationStatus !== "Approved") {
        throw new AppError("Worker application status is not approved", 403);
    }

    // Generate 4-digit OTP for booking verification
    const otp = data.otp || crypto.randomInt(1000, 10000).toString();

    // Generate new booking
    const newBooking = await Booking.create({
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
}

export const getAllBookingsService = async(data:string)=>{
    const workerAuthId= data;

    //check role woker validation

    const allBooking = await Booking.find({workerAuthId:workerAuthId, bookingStatus:"Pending"});
    return allBooking;
} 