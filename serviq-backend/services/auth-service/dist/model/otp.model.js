"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "Email Is required"]
    },
    otp: {
        type: String,
        required: [true, "Otp is required"],
        maxLength: 4
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60
    }
});
exports.Otp = mongoose_1.default.model("Otp", otpSchema);
