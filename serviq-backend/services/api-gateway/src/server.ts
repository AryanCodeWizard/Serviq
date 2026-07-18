import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import { authMiddleware } from './middlewares/auth.middleware';
import cookieParser from 'cookie-parser';
import { Request,Response,NextFunction } from 'express';
import cors from 'cors';
dotenv.config();

const app=express();

const PORT = process.env.PORT;
app.use(cookieParser());
app.use(cors());

//logger 
app.use((req: Request,res: Response,next: NextFunction)=>{
    console.log(`${req.method} ${req.url}`);
    next();
})

const authProxy = proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/auth", "");
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = (srcReq as any).user;

        proxyReqOpts.headers = proxyReqOpts.headers || {};

        if (user?.userId) {
            proxyReqOpts.headers["userId"] = user.userId;
        }
        console.log("USER id: ", user?.userId);
        return proxyReqOpts;
    },
    //if sercie is down
    proxyErrorHandler: (err:any,res:Response,next:NextFunction) => {
        console.log("Proxy Error: ",err.message);
        res.status(502).json({
        success: false,
        message: "Auth service is unavailable",
    });
    }

});
app.use("/api/v1/auth/update-password",authMiddleware,authProxy);

//Public Routes
app.use("/api/v1/auth/",authProxy);

//global error middleware;


app.listen(PORT,()=>{
    console.log(`Api gateway is successfully running on PORT ${PORT}`)
})