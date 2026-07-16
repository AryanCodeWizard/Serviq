"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailService = void 0;
const otp_model_1 = require("../model/otp.model");
const user_model_1 = require("../model/user.model");
const appError_1 = require("../utils/appError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const axios_1 = __importDefault(require("axios"));
const mail_template_1 = require("../templates/mail.template");
const sendEmailService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fullName, email, password, role } = data;
    const isExist = yield user_model_1.User.findOne({ email: email });
    if (isExist) {
        throw new appError_1.AppError("User already registered", 409);
    }
    //Generate OTP
    const newOtp = yield otp_generator_1.default.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    const mailServiceBaseUrl = (_a = process.env.MAIL_SERVICE_URL) !== null && _a !== void 0 ? _a : "http://localhost:5000";
    const mailServiceCall = yield axios_1.default.post(`${mailServiceBaseUrl}/api/v1/send-mail`, {
        email: email,
        subject: "Your OTP for Registration",
        body: (0, mail_template_1.sendmailTemplate)(fullName, Number(newOtp)),
        from: "noreply@kamwale.com"
    });
    //save otp to databse
    const otpDoc = yield otp_model_1.Otp.create({ email: email, otp: newOtp });
    return otpDoc;
});
exports.sendEmailService = sendEmailService;
