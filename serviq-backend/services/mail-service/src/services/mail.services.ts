import { AppError } from '../utils/appError';
import { ApiResponse } from '../types/apiResponse';
import { IMailData } from '../controllers/mail.controller';
import { transporter } from '../config/mail.config';

// 

export const sendMailService = async (data: IMailData) => {
       let info =  await transporter.sendMail({
            from: data.from,
            to: data.email,
            subject: data.subject,
            html: data.body
        }); 
        
    return info;
}