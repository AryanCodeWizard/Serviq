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
const user_model_1 = require("../model/user.model");
const appError_1 = require("../utils/appError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const mail_template_1 = require("../templates/mail.template");
const redis_config_1 = require("../config/redis.config");
const otpProducer_1 = require("../producers/otpProducer");
const sendEmailService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email } = data;
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
    console.log(newOtp);
    const client = (0, redis_config_1.getRedisClient)();
    yield client.set(`signup_otp:${email}`, newOtp, { EX: 300 });
    const mailData = {
        email: email,
        subject: "Your OTP for Registration",
        body: (0, mail_template_1.sendmailTemplate)(fullName, newOtp),
        from: "noreply@kamwale.com"
    };
    (0, otpProducer_1.sendOtpMessage)(mailData);
    // const mailServiceBaseUrl = process.env.MAIL_SERVICE_URL ?? "http://localhost:5000";
    // const mailServiceCall = await axios.post(`${mailServiceBaseUrl}/api/v1/send-mail`,mailData);
});
exports.sendEmailService = sendEmailService;
