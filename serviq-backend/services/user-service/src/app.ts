import express, { Application } from 'express';
import dotenv from 'dotenv'
import router from './routes/user.route';
dotenv.config();
const app: Application= express();


app.use(express.json());
app.use("/",router);

export default app;