import express, { Request, Response, NextFunction } from 'express';
import { type IBookingData } from '../model/booking.model';
import {
    createBookingService,
    getAllBookingsService,
    getBookingDetailsService,
    getCustomerBookingsService,
    getWorkerBookingsService,
    updateBookingStatusService,
} from '../services/booking.service';
import { AppError } from '../utils/appError';

const readHeaderValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customerAuthId, workerAuthId, service, bookingDate, bookingTime,
            customerAddress, customerPhoneNumber, workerPhoneNumber, problemDescription,
            price
        } = req.body;

        const authUserId = readHeaderValue(req.headers["userid"]);
        const resolvedCustomerAuthId = authUserId || customerAuthId;

        // 1. Check Mandatory Fields
        if (!resolvedCustomerAuthId || !service || !bookingDate || !bookingTime || !customerAddress || !customerPhoneNumber || price === undefined || price === null) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // 2. Group data safely for your database
        const cleanBookingData: IBookingData = {
            customerAuthId: resolvedCustomerAuthId,
            workerAuthId: workerAuthId || undefined,
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

        const createdBooking = await createBookingService(cleanBookingData);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            data: createdBooking
        });

    } catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.message || "Internal server error." 
        });
    }
}

export const getAllBookings =  async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const workerAuthId = readHeaderValue(req.headers["userid"]);
        if (!workerAuthId) throw new AppError("Unable to fetch user Id", 400);

        const bookingStatus = req.query.status as string | undefined;
        const getAllBookingsCall = await getAllBookingsService(workerAuthId);
        res.status(200).json({
            success:true,
            message:"All booking fecthed successfully",
            data: getAllBookingsCall
        })

    }
    catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({ 
            success: false, 
            message: error.message || "Internal server error." 
        });
    }
}

export const getWorkerBookings = async (req: Request, res: Response) => {
    try {
        const workerAuthId = readHeaderValue(req.headers["userid"]);
        if (!workerAuthId) throw new AppError("Unable to fetch user Id", 400);

        const bookingStatus = req.query.status as string | undefined;
        const bookings = await getWorkerBookingsService(workerAuthId, bookingStatus);

        res.status(200).json({
            success: true,
            message: "Worker bookings fetched successfully",
            data: bookings,
        });
    } catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const getCustomerBookings = async (req: Request, res: Response) => {
    try {
        const customerAuthId = readHeaderValue(req.headers["userid"]);
        if (!customerAuthId) throw new AppError("Unable to fetch user Id", 400);

        const bookingStatus = req.query.status as string | undefined;
        const bookings = await getCustomerBookingsService(customerAuthId, bookingStatus);

        res.status(200).json({
            success: true,
            message: "Customer bookings fetched successfully",
            data: bookings,
        });
    } catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const getBookingDetails = async (req: Request, res: Response) => {
    try {
        const bookingId = readHeaderValue(req.params.bookingId);
        const actorAuthId = readHeaderValue(req.headers["userid"]);
        const actorRole = readHeaderValue(req.headers["role"]) as "User" | "Worker" | undefined;

        if (!bookingId) throw new AppError("Booking id is required", 400);
        if (!actorAuthId) throw new AppError("Unable to fetch user Id", 400);
        if (!actorRole) throw new AppError("Unable to fetch user role", 400);

        const booking = await getBookingDetailsService(bookingId, actorAuthId, actorRole);

        res.status(200).json({
            success: true,
            message: "Booking details fetched successfully",
            data: booking,
        });
    } catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = readHeaderValue(req.params.bookingId);
        const actorAuthId = readHeaderValue(req.headers["userid"]);
        const actorRole = readHeaderValue(req.headers["role"]) as "User" | "Worker" | undefined;
        const { bookingStatus, rejectReason } = req.body;

        if (!bookingId) throw new AppError("Booking id is required", 400);
        if (!actorAuthId) throw new AppError("Unable to fetch user Id", 400);
        if (!actorRole) throw new AppError("Unable to fetch user role", 400);
        if (!bookingStatus) throw new AppError("Booking status is required", 400);

        const updatedBooking = await updateBookingStatusService({
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
    } catch (error: any) {
        console.error("Booking Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};