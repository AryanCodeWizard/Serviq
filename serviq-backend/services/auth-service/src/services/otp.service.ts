
import { IUser } from '../model/user.model'
import { User } from '../model/user.model'
import { AppError } from '../utils/appError';
import otpGenerator from 'otp-generator'
import axios from 'axios';
import { sendmailTemplate } from '../templates/mail.template';
import { getRedisClient } from '../config/redis.config';
import { sendOtpMessage } from '../producers/otpProducer';
interface IUserData {
    fullName: string,
    email: string,
    // password: string,
    // role: "User" | "Worker" | "Admin"
}


export const sendEmailService = async (data: IUserData) => {
    const { fullName, email } = data;
    const isExist = await User.findOne({ email: email })
    if (isExist) {
        throw new AppError("User already registered", 409);
    }
    //Generate OTP
    const newOtp = await otpGenerator.generate(4,
        {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        }
    )
     console.log(newOtp);

    const client = getRedisClient();
    await client.set(`signup_otp:${email}`,newOtp,{EX:300});

    const mailData = {
        email: email,
        subject: "Your OTP for Registration",
        body: sendmailTemplate(fullName, newOtp),
        from: "noreply@kamwale.com"
    }

    
    sendOtpMessage(mailData);

    
    // const mailServiceBaseUrl = process.env.MAIL_SERVICE_URL ?? "http://localhost:5000";

    // const mailServiceCall = await axios.post(`${mailServiceBaseUrl}/api/v1/send-mail`,mailData);

}
