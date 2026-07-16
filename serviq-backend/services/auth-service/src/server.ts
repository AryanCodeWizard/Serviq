import app from './app';
import dotenv from 'dotenv'
import { dbConnect } from './config/db.config';
import { redisConnect } from './config/redis.config';


dotenv.config();
const PORT=process.env.PORT;

dbConnect();
redisConnect();

app.listen(PORT,()=>{
    console.log(`Auth Service is successfully listening on PORT ${PORT}`);
})
