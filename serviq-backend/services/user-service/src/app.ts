import express, { Application } from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload';
import router from './routes/user.route';
dotenv.config();
const app: Application= express();

// Parse multipart/form-data (needed for file uploads — populates req.body and req.files)
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/",router);

export default app;