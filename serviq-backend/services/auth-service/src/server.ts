import app from './app';
import dotenv from 'dotenv'
import { dbConnect } from './config/db.config';
import { redisConnect } from './config/redis.config';
import { rabbitMQConnect } from './config/rabbitMQ.config'


dotenv.config();
const PORT = process.env.PORT;

const startServer = async () => {
    await dbConnect();
    await redisConnect();
    await rabbitMQConnect();

    app.listen(PORT, () => {
        console.log(`Auth Service is successfully listening on PORT ${PORT}`);
    })
}
startServer();

