import app from './app';
import dotenv from 'dotenv'
import { dbConnect } from './config/db.config';

dotenv.config();
const PORT=process.env.PORT;

dbConnect();

app.listen(PORT,()=>{
    console.log(`Auth Service is successfully listening on PORT ${PORT}`);
})
