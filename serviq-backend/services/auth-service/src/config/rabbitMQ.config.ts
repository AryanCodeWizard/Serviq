
// amqplib is official node js library for communication with RabbitMQ

// It allows you to:
// Connect to RabbitMQ
// Create channels
// Create exchanges
// Create queues
// Publish messages
// Consume messages


// Server Starts
//       │
//       ▼
// rabbitMQConnect()
//       │
//       ▼
// Connect to RabbitMQ
//       │
//       ▼
// Create Connection
//       │
//       ▼
// Create Channel
//       │
//       ▼
// Ensure Exchange Exists
//       │
//       ▼
// Application Ready
//       │
//       ▼
// Other Files
//       │
//       ▼
// getRabbitMQChannel()
//       │
//       ▼
// Publish / Consume Messages



import amqplib, { Channel } from 'amqplib';

let channel: Channel;
export const mail_exchange = "mail_exchange"
export const profile_exchange="profile_exchange_name";

export const rabbitMQConnect = async () => {
    try {

        const connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertExchange(mail_exchange, "direct", { durable: true });
        await channel.assertExchange(profile_exchange, "direct", { durable: true });

        console.log("RabbitMQ connection established successfully");

    }
    catch (error) {
        console.log("RabbitMQ connection failed", error);
    }
}


export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not get");
    }
    return channel;
}
