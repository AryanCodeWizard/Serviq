export type BookingStatus = "Pending" | "Accepted" | "Cancelled" | "In Progress" | "Completed";
export type PaymentMethod = "Cash" | "Online" | "Not Selected";
export type PaymentStatus = "Pending" | "Paid" | "Refunded";

export interface BookingPayload {
    customerAuthId: string;
    workerAuthId: string;
    service: string | string[];
    bookingDate: string;
    bookingTime: string;
    customerAddress: string;
    customerPhoneNumber: string;
    workerPhoneNumber: string;
    problemDescription?: string;
    price: number;
    otp?: string;
}

export interface UpdateBookingStatusPayload {
    bookingStatus: BookingStatus;
    rejectReason?: string;
}