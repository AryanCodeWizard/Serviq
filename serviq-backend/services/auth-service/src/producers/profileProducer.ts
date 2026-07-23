import { getRabbitMQChannel, profile_exchange } from "../config/rabbitMQ.config"


// let channel;
export const sendProfileMaessage =(data:any) => {
    const channel = getRabbitMQChannel();
    channel.publish(profile_exchange,"profile_routing_key",Buffer.from(JSON.stringify(data)));
} 