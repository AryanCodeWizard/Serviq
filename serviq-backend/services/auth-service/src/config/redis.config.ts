import { createClient ,RedisClientType} from 'redis';


let client: RedisClientType;

export const redisConnect = async () => {
    client = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: 19787
        }
    });

    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    console.log("Auth service redis connected successfully")
}

export const getRedisClient = ()=>{
    if(!client){
        throw new Error("Redis Client not initialzed");
    }
    return client;
}