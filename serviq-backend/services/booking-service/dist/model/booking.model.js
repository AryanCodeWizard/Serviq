"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
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
        enum: ["Cash", "Online", "Not Selected"],
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
    },
    slotKey: {
        type: String,
        index: true,
    },
    assignedWorkerName: {
        type: String,
        default: "",
    },
    assignedWorkerEmail: {
        type: String,
        default: "",
    }
}, { timestamps: true });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
