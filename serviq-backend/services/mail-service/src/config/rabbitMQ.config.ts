import amqplib, { Channel } from 'amqplib';


let channel: Channel;
export const mail_exchange = "mail_exchange";
export const mail_routing_key = "mail_routing";
export const queue_name = "mail_queue";

export const rabbitMQConnect = async () => {
    try {

        const connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();
        await channel.assertExchange(mail_exchange, "direct", { durable: true });

        await channel.assertQueue("mail_queue", { durable: true });

        await channel.bindQueue(
            queue_name,
            mail_exchange,
            mail_routing_key
        );
        console.log("RabbitMQ connection established successfully");
    }
    catch (error) {
        console.log(" Mail RabbitMQ connection failed", error);
    }
}

export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not get");
    }
    return channel;
}