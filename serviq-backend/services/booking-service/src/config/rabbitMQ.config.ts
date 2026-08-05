import amqplib, { Channel } from 'amqplib';

let channel: Channel | undefined;

export const mail_exchange = "mail_exchange";
export const mail_routing_key = "mail_routing";

export const rabbitMQConnect = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertExchange(mail_exchange, "direct", { durable: true });

        console.log("Booking service RabbitMQ connection established successfully");
    } catch (error) {
        console.log("Booking service RabbitMQ connection failed", error);
    }
};

export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    return channel;
};