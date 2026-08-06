
import express from 'express';
import dotenv from 'dotenv';
import proxy from 'express-http-proxy';
import { authMiddleware } from './middlewares/auth.middleware';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARES ──────────────────────────────────────────────────────
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,              // Required: allow cookies to be sent cross-origin
}));

// Logger
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ─── AUTH SERVICE PROXY (PORT 3001) ───────────────────────────────────

// ─── AUTH SERVICE PROXY (PORT 3001) ───────────────────────────────────
const authProxy = proxy("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/auth", "");
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = (srcReq as any).user;

        proxyReqOpts.headers = proxyReqOpts.headers || {};

        // Pass authenticated user information
        if (user?.userId) {
            proxyReqOpts.headers["userid"] = user.userId;
        }

        if (user?.email) {
            proxyReqOpts.headers["email"] = user.email;
        }

        if (user?.role) {
            proxyReqOpts.headers["role"] = user.role;
        }

       console.log("Auth Proxy -> User:", user);

        return proxyReqOpts;
    },

    proxyErrorHandler: (err: any, res: Response) => {
        console.error("Auth Proxy Error:", err.message);

        res.status(502).json({
            success: false,
            message: "Auth service is unavailable",
        });
    }
});

// ─── USER/PROFILE SERVICE PROXY (PORT 6000) ───────────────────────────
const userServiceProxy = proxy("http://localhost:6000", {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/users", "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = (srcReq as any).user;
        proxyReqOpts.headers = proxyReqOpts.headers || {};

        // Pass down user identities decoded from authMiddleware
        // Note: HTTP headers are lowercased by Node.js — use "userid" consistently
        if (user?.userId) {
            proxyReqOpts.headers["userid"] = String(user.userId);
        }
        if (user?.email) {
            proxyReqOpts.headers["email"] = user.email;
        }
        if (user?.role) {
            proxyReqOpts.headers["role"] = user.role;
        }
        //FOR TESTING
        const userId = user.userID;
        if(userId){
            console.log(`Forwarding request to user service with userId ${userId}`);
        }
        //DONE

        console.log("USER id sent to User Service: ", user?.userId);
        return proxyReqOpts;
    },
    proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
        console.error("User Proxy Error: ", err.message);
        res.status(502).json({
            success: false,
            message: "User service is unavailable",
        });
    }
});

// ─── BOOKING SERVICE PROXY (PORT 7001) ────────────────────────────────
const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || "http://localhost:7001";

const bookingServiceProxy = proxy(bookingServiceUrl, {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/api\/v1\/bookings?/, "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = (srcReq as any).user;
        proxyReqOpts.headers = proxyReqOpts.headers || {};

        if (user?.userId) {
            proxyReqOpts.headers["userid"] = String(user.userId);
        }
        if (user?.email) {
            proxyReqOpts.headers["email"] = user.email;
        }
        if (user?.role) {
            proxyReqOpts.headers["role"] = user.role;
        }

        console.log("Booking Proxy -> User:", user);
        return proxyReqOpts;
    },
    proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
        console.error("Booking Proxy Error: ", err.message);
        res.status(502).json({
            success: false,
            message: "Booking service is unavailable",
        });
    }
});

// ─── ROUTES DEFINITION ────────────────────────────────────────────────

// 1. Protected Auth Routes (Require Token Validation)
app.use("/api/v1/auth/update-password", authMiddleware, authProxy);

// 2. Public Auth Routes (Login, Register, etc.)
app.use("/api/v1/auth", authProxy);

// 3. User Service Routes (Mapped distinctly to avoid being swallowed by authProxy)
// Added authMiddleware here assuming user profiles are protected endpoints
app.use("/api/v1/users", authMiddleware, userServiceProxy);

// 4. Booking Service Routes
app.use("/api/v1/booking", authMiddleware, bookingServiceProxy);
app.use("/api/v1/bookings", authMiddleware, bookingServiceProxy);

// ─── APP INITIALIZATION ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Api gateway is successfully running on PORT ${PORT}`);
});
