import type { AxiosRequestConfig } from "axios";
import api from "./axios";
import type { BookingPayload, UpdateBookingStatusPayload } from "../types/booking";

export const createBookingAPI = (data: BookingPayload, config?: AxiosRequestConfig) => {
    return api.post("/bookings/create-booking", data, config);
};

export const getWorkerBookingsAPI = (status?: string, config?: AxiosRequestConfig) => {
    return api.get("/bookings/worker-bookings", {
        params: status ? { status } : undefined,
        ...config,
    });
};

export const getCustomerBookingsAPI = (status?: string, config?: AxiosRequestConfig) => {
    return api.get("/bookings/customer-bookings", {
        params: status ? { status } : undefined,
        ...config,
    });
};

export const getBookingDetailsAPI = (bookingId: string, config?: AxiosRequestConfig) => {
    return api.get(`/bookings/${bookingId}`, config);
};

export const updateBookingStatusAPI = (bookingId: string, data: UpdateBookingStatusPayload, config?: AxiosRequestConfig) => {
    return api.patch(`/bookings/${bookingId}/status`, data, config);
};