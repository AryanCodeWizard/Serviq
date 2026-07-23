
import amqplib, { Channel } from 'amqplib';

let channel: Channel;
export const profile_exchange="profile_exchange_name";
export const profile_queue = "profile_queue";
export const profile_routing_key = "profile_routing_key"


export const rabbitMQConnect = async () => {
    try {

        const connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertExchange(profile_exchange, "direct", { durable: true });
        await channel.assertQueue(profile_queue,{durable:true});
       await channel.bindQueue(profile_queue, profile_exchange, profile_routing_key);

        console.log("RabbitMQ connection established successfully in user service");

    }
    catch (error) {
        console.log("RabbitMQ connection failed in user-service", error);
    }
}


export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not get in user service");
    }
    return channel;
}
