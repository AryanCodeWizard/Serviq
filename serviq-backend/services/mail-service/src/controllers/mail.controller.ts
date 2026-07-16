
import express, { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { ApiResponse } from '../types/apiResponse';
import { sendMailService } from '../services/mail.services';

export interface IMailData {
    email: string;
    subject: string;
    body: string;
    from: string;
}

export const sendMailController = async (req: Request, res: Response) => {
    try {
        const { email, subject, body, from }: IMailData = req.body;
        // Validate required fields
        if (!email || !subject || !body || !from) {
            throw new AppError('Missing required fields: email, subject, body, and from are required.', 400);
        }

        //call mail service to send email
        const mailService = await sendMailService({
            email,subject,body,from
        });

        res.status(200).json({
            success: true, message: 'Email sent successfully'
        } as ApiResponse<null>);

    }
    catch (error: any) {
        console.error('Error sending email:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal Server Error' });
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error', error });
        }
    }
}