import { getRabbitMQChannel, mail_exchange, mail_routing_key } from "../config/rabbitMQ.config";

export interface IBookingMailData {
    email: string;
    from: string;
    subject: string;
    body: string;
}

export const sendBookingMailMessage = (data: IBookingMailData) => {
    const channel = getRabbitMQChannel();

    channel.publish(
        mail_exchange,
        mail_routing_key,
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
    );
};