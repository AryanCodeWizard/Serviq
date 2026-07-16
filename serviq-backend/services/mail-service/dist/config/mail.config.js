"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number((_a = process.env.MAIL_PORT) !== null && _a !== void 0 ? _a : 587),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: (_b = process.env.MAIL_USER) !== null && _b !== void 0 ? _b : process.env.EMAIL_USER,
        pass: (_c = process.env.MAIL_PASS) !== null && _c !== void 0 ? _c : process.env.EMAIL_PASS
    }
});
