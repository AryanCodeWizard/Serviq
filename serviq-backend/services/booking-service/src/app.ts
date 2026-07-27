import express, { Application } from 'express';
import dotenv from 'dotenv'
import router from './routes/booking.routes';

// import router from './routes/user.route';
dotenv.config();
const app: Application= express();


// also add error midllware in future

// Parse multipart/form-data (needed for file uploads — populates req.body and req.files)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",router);

export default app;