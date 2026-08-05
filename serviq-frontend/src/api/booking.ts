import api from "./axios";
import type { BookingPayload, UpdateBookingStatusPayload } from "../types/booking";

export const createBookingAPI = (data: BookingPayload) => {
    return api.post("/bookings/create-booking", data);
};

export const getWorkerBookingsAPI = (status?: string) => {
    return api.get("/bookings/worker-bookings", {
        params: status ? { status } : undefined,
    });
};

export const getCustomerBookingsAPI = (status?: string) => {
    return api.get("/bookings/customer-bookings", {
        params: status ? { status } : undefined,
    });
};

export const getBookingDetailsAPI = (bookingId: string) => {
    return api.get(`/bookings/${bookingId}`);
};

export const updateBookingStatusAPI = (bookingId: string, data: UpdateBookingStatusPayload) => {
    return api.patch(`/bookings/${bookingId}/status`, data);
};