import app from "./app";
import { rabbitMQConnect } from "./config/rabbitMQ.config";

import dotenv from "dotenv";
import { mailOtpConsumer } from "./consumer/otpConsumer";
dotenv.config();


const PORT = process.env.PORT || 5000;


const startServer = async () => {
    await rabbitMQConnect();
    await mailOtpConsumer();
    app.listen(PORT, () => {
        console.log(`Mail service is running on PORT ${PORT}`);
    });
}



startServer();