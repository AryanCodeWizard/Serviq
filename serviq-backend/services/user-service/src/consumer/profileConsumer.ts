import { profile_queue } from "../config/rabbitMQ.config";
import { getRabbitMQChannel } from "../config/rabbitMQ.config";
import {Channel} from 'amqplib'
import { createUserProfile } from "../controllers/user.controller";
import { createUserProfileService } from "../services/profile.service";


export const profileConsumer = ()=>{
    try{

        const channel = getRabbitMQChannel();

        channel.consume(profile_queue,async(data)=>{
            if(data!==null){
                try{

                    await createUserProfileService(JSON.parse(data.content.toString()));
                    channel.ack(data);

                }
                catch(error){
                    channel.nack(data);
                }
            }

        })

    }
     catch(error){
        console.log("failed to get data in cunsumer");
     }
}