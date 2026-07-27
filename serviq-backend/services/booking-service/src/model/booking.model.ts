import mongoose from 'mongoose';

export interface IBookingData{
    customerAuthId: string,
    workerAuthId: string,
    service: string[],
    bookingDate: string,
    bookingTime: string,
    customerAddress: string,
    customerPhoneNumber: string,
    workerPhoneNumber: string,
    problemDescription: string,
    price: number,
    paymentMethod: "Cash" | "Online" | "Not Selected",
    paymentStatus: "Pending" | "Paid" | "Refunded",
    bookingStatus: "Pending" | "Accepted" | "Cancelled" | "In Progress" | "Completed"
    rejectReason: string,
    customerRating: number,
    customerReview: string,
    otp: string

}

const bookingSchema = new mongoose.Schema<IBookingData>({
    customerAuthId: {
        type: String,
        required: true
    },
    workerAuthId: {
        type: String,
        required: true
    },
    service: {
        type: [String],
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    customerPhoneNumber: {
        type: String,
        required: true
    },
    workerPhoneNumber: {
        type: String,
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Online","Not Selected"],
        default: "Not Selected"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Refunded"],
         default: "Pending"
    },
    bookingStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Cancelled", "In Progress", "Completed"],
         default: "Pending"
    },
    rejectReason: {
        type: String,
    },
    customerRating: {
        type: Number
    },
    customerReview: {
        type: String
    },
    otp: {
        type: String
    }

},{timestamps:true})

export const Booking = mongoose.model("Booking",bookingSchema);
