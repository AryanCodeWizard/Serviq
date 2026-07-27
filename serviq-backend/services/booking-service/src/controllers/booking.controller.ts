import express, { Request, Response, NextFunction } from 'express';
import type { IBookingData } from '../model/booking.model';

import {createBookingService} from '../services/booking.service'


const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customerAuthId, workerAuthId, service, bookingDate, bookingTime, 
            customerAddress, customerPhoneNumber, workerPhoneNumber, problemDescription, 
            price
        } = req.body;

        // 1. Check Mandatory Fields
        if (!customerAuthId || !workerAuthId || !service || !bookingDate || !bookingTime || !customerAddress || !customerPhoneNumber || !price || !workerPhoneNumber || !customerPhoneNumber) {
            //throe new AppError make in future
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // 4. Group data safely for your database
        const cleanBookingData = {
            customerAuthId,
            workerAuthId,
            service,
            bookingDate,
            bookingTime,
            customerAddress,
            customerPhoneNumber,
            price,
            workerPhoneNumber: workerPhoneNumber || "",
            problemDescription: problemDescription || "",
        }

        const createdBooking = await createBookingService(cleanBookingData);

        return res.status(201).json({
            success: true,
            message: "Booking data validated and received successfully!",
            data: cleanBookingData
        });

    } catch (error) {
        console.error("Booking Validation Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error." 
        });
    }

}