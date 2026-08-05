import { Booking, type IBookingData } from "../model/booking.model";
import { AppError } from "../utils/appError";
import axios from 'axios';
import crypto from 'crypto';
import { sendBookingMailMessage } from "../producers/bookingMail.producer";

type BookingRole = "User" | "Worker";
type BookingStatus = NonNullable<IBookingData["bookingStatus"]>;

interface IBookingStatusUpdate {
    bookingId: string;
    actorAuthId: string;
    actorRole: BookingRole;
    bookingStatus: BookingStatus;
    rejectReason?: string;
}

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

const buildBookingMailBody = (title: string, recipientName: string, booking: any) => {
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

const dispatchBookingEmails = async (booking: any) => {
    try {
        const [customerResult, workerResult] = await Promise.allSettled([
            axios.get(resolveCustomerProfileEndpoint(), {
                headers: { userid: booking.customerAuthId },
            }),
            axios.get(resolveUserServiceEndpoint(), {
                params: { userId: booking.workerAuthId },
            }),
        ]);

        const mailFrom = process.env.MAIL_FROM || "noreply@serviq.com";

        if (customerResult.status === "fulfilled") {
            const customer = customerResult.value?.data?.data;
            if (customer?.email) {
                sendBookingMailMessage({
                    email: customer.email,
                    from: mailFrom,
                    subject: "Booking confirmed",
                    body: buildBookingMailBody(customer.fullName || "Customer", customer.fullName || "Customer", booking),
                });
            }
        }

        if (workerResult.status === "fulfilled") {
            const worker = workerResult.value?.data?.data;
            if (worker?.email) {
                sendBookingMailMessage({
                    email: worker.email,
                    from: mailFrom,
                    subject: "New booking assigned",
                    body: buildBookingMailBody(worker.fullName || "Worker", worker.fullName || "Worker", booking),
                });
            }
        }
    } catch (error) {
        console.error("Booking email dispatch failed:", error);
    }
};

const validateBookingOwnership = (booking: any, actorAuthId: string, actorRole: BookingRole) => {
    if (actorRole === "Worker" && booking.workerAuthId !== actorAuthId) {
        throw new AppError("You are not allowed to access this booking", 403);
    }

    if (actorRole === "User" && booking.customerAuthId !== actorAuthId) {
        throw new AppError("You are not allowed to access this booking", 403);
    }
};

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
    let workerResponse;
    try {
        workerResponse = await axios.get(resolveUserServiceEndpoint(), {
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

    void dispatchBookingEmails(newBooking);

    return newBooking;
}

export const getAllBookingsService = async(data:string)=>{
    const workerAuthId= data;

    //check role woker validation

    const allBooking = await Booking.find({workerAuthId:workerAuthId, bookingStatus:"Pending"});
    return allBooking;
} 

export const getWorkerBookingsService = async (workerAuthId: string, bookingStatus?: string) => {
    const query: Record<string, unknown> = { workerAuthId };

    if (bookingStatus && bookingStatus !== "all") {
        query.bookingStatus = bookingStatus;
    }

    return Booking.find(query).sort({ createdAt: -1 });
};

export const getCustomerBookingsService = async (customerAuthId: string, bookingStatus?: string) => {
    const query: Record<string, unknown> = { customerAuthId };

    if (bookingStatus && bookingStatus !== "all") {
        query.bookingStatus = bookingStatus;
    }

    return Booking.find(query).sort({ createdAt: -1 });
};

export const getBookingDetailsService = async (bookingId: string, actorAuthId: string, actorRole: BookingRole) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new AppError("Booking not found", 404);
    }

    validateBookingOwnership(booking, actorAuthId, actorRole);

    return booking;
};

export const updateBookingStatusService = async (data: IBookingStatusUpdate) => {
    const { bookingId, actorAuthId, actorRole, bookingStatus, rejectReason } = data;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new AppError("Booking not found", 404);
    }

    validateBookingOwnership(booking, actorAuthId, actorRole);

    if (actorRole === "User") {
        if (bookingStatus !== "Cancelled") {
            throw new AppError("Customers can only cancel bookings", 403);
        }

        if (["Cancelled", "Completed"].includes(booking.bookingStatus || "")) {
            throw new AppError("Booking cannot be cancelled in its current state", 400);
        }

        if (booking.bookingStatus === "In Progress") {
            throw new AppError("In progress bookings cannot be cancelled by customers", 400);
        }

        booking.bookingStatus = "Cancelled";
        booking.rejectReason = rejectReason || "Cancelled by customer";
    }

    if (actorRole === "Worker") {
        switch (bookingStatus) {
            case "Accepted":
                if (booking.bookingStatus !== "Pending") {
                    throw new AppError("Only pending bookings can be accepted", 400);
                }
                booking.bookingStatus = "Accepted";
                booking.rejectReason = "";
                break;
            case "In Progress":
                if (booking.bookingStatus !== "Accepted") {
                    throw new AppError("Only accepted bookings can move to in progress", 400);
                }
                booking.bookingStatus = "In Progress";
                booking.rejectReason = "";
                break;
            case "Completed":
                if (booking.bookingStatus !== "In Progress") {
                    throw new AppError("Only in progress bookings can be completed", 400);
                }
                booking.bookingStatus = "Completed";
                booking.rejectReason = "";
                break;
            case "Cancelled":
                if (!["Pending", "Accepted"].includes(booking.bookingStatus || "")) {
                    throw new AppError("Only pending or accepted bookings can be cancelled", 400);
                }
                booking.bookingStatus = "Cancelled";
                booking.rejectReason = rejectReason || "Cancelled by worker";
                break;
            default:
                throw new AppError("Invalid booking status update", 400);
        }
    }

    await booking.save();

    return booking;
};