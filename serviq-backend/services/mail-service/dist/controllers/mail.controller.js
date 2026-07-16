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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailController = void 0;
const appError_1 = require("../utils/appError");
const mail_services_1 = require("../services/mail.services");
const sendMailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subject, body, from } = req.body;
        // Validate required fields
        if (!email || !subject || !body || !from) {
            throw new appError_1.AppError('Missing required fields: email, subject, body, and from are required.', 400);
        }
        //call mail service to send email
        const mailService = yield (0, mail_services_1.sendMailService)({
            email, subject, body, from
        });
        res.status(200).json({
            success: true, message: 'Email sent successfully'
        });
    }
    catch (error) {
        console.error('Error sending email:', error);
        if (error instanceof appError_1.AppError) {
            res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal Server Error' });
        }
        else {
            res.status(500).json({ success: false, message: 'Internal Server Error', error });
        }
    }
});
exports.sendMailController = sendMailController;
