import type { AxiosRequestConfig } from "axios";
import { createBookingAPI, getBookingDetailsAPI, getCustomerBookingsAPI, getWorkerBookingsAPI, updateBookingStatusAPI } from "../../../api/booking";
import type { BookingPayload, UpdateBookingStatusPayload } from "../../../types/booking";

export const createBookingAPICall = (data: BookingPayload, config?: AxiosRequestConfig) => {
    return createBookingAPI(data, config);
};

export const getBookingDetailsAPICall = (bookingId: string, config?: AxiosRequestConfig) => {
    return getBookingDetailsAPI(bookingId, config);
};

export const getCustomerBookingsAPICall = (status?: string, config?: AxiosRequestConfig) => {
    return getCustomerBookingsAPI(status, config);
};

export const getWorkerBookingsAPICall = (status?: string, config?: AxiosRequestConfig) => {
    return getWorkerBookingsAPI(status, config);
};

export const updateBookingStatusAPICall = (bookingId: string, data: UpdateBookingStatusPayload, config?: AxiosRequestConfig) => {
    return updateBookingStatusAPI(bookingId, data, config);
};