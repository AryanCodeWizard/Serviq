import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import { authMiddleware } from './middlewares/auth.middleware';
dotenv.config();

const app=express();

const PORT = process.env.PORT;


const authProxy=proxy("http://localhost:3001",{
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/auth", "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // You can modify the proxy request options here if needed
        const user = (srcReq as any).user;
        if (user) {
            proxyReqOpts.headers['user_id'] = String(user._id ?? user.id ?? '');
        }
        return proxyReqOpts;
    }
})

//Public Routes
app.use("/api/v1/auth/send-email-auth",authProxy);
app.use("/api/v1/auth/signUp",authProxy);
app.use("/api/v1/auth/login",authProxy);
app.use("/api/v1/auth/forgot-password",authProxy);
app.use("/api/v1/auth/reset-password",authProxy);

//Protected Routes
app.use("/api/v1/auth/forgot-password/verify-otp",authMiddleware,authProxy);
app.use("/api/v1/auth/update-password",authMiddleware,authProxy);



app.listen(PORT,()=>{
    console.log(`Api gateway is successfully running on PORT ${PORT}`)
})