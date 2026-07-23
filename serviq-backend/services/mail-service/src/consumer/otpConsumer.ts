import { getRabbitMQChannel, queue_name } from "../config/rabbitMQ.config";
import { sendMailService } from "../services/mail.services";

export const mailOtpConsumer = () => {
    const channel = getRabbitMQChannel();

    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    channel.consume(
        queue_name,
        async (message) => {
            if (!message) return;

            try {
                const data = JSON.parse(message.content.toString());

                console.log("Received:", message.content.toString());

                await sendMailService(data);

                channel.ack(message);
            } catch (error) {
                console.error("Mail Consumer Error:", error);
                channel.nack(message);
            }
        },
        {
            noAck: false,
        }
    );
};