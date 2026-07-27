import express, { Application } from 'express';
import dotenv from 'dotenv'
import router from './routes/booking.routes';

// import router from './routes/user.route';
dotenv.config();
const app: Application= express();


// also add error midllware in future

// 1. THIS LINE MUST BE PRESENT AND PLACE BEFORE YOUR ROUTES
app.use(express.json()); 

// 2. Optional: If you send data via URL-encoded forms from Postman
app.use(express.urlencoded({ extended: true }));

app.use("/",router);

export default app;