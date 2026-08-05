"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        trim: true,
        required: [true, "FullName field is missing"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email field is missing"]
    },
    password: {
        type: String,
        required: [true, "Password field is missing"]
    },
    role: {
        type: String,
        enum: ["User", "Worker", "Admin"],
        default: "User"
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiry: {
        type: Date,
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
