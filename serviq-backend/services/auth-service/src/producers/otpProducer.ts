import { getRabbitMQChannel, mail_exchange } from "../config/rabbitMQ.config"


export const sendOtpMessage = (data: any) => {
    const channel = getRabbitMQChannel();

    const published = channel.publish(
        mail_exchange,
        "mail_routing",
        Buffer.from(JSON.stringify(data))
    );

    console.log("Message published:", published);
};