import express, { Request, Response, NextFunction } from 'express';
import { type IBookingData } from '../model/booking.model';
import { createBookingService, getAllBookingsService } from '../services/booking.service';
import { AppError } from '../utils/appError';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customerAuthId, workerAuthId, service, bookingDate, bookingTime, 
            customerAddress, customerPhoneNumber, workerPhoneNumber, problemDescription, 
            price
        } = req.body;

        console.log(req.body);

        // 1. Check Mandatory Fields
        if (!customerAuthId || !workerAuthId || !service || !bookingDate || !bookingTime || !customerAddress || !customerPhoneNumber || !price || !workerPhoneNumber) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // 2. Group data safely for your database
        const cleanBookingData: IBookingData = {
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
        const workerAuthId = req.headers["userid"] as string;
        if (!workerAuthId) throw new AppError("Unable to fetch user Id", 400);

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