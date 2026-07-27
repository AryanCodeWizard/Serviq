"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ─── MIDDLEWARES ──────────────────────────────────────────────────────
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true, // Required: allow cookies to be sent cross-origin
}));
// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// ─── AUTH SERVICE PROXY (PORT 3001) ───────────────────────────────────
// ─── AUTH SERVICE PROXY (PORT 3001) ───────────────────────────────────
const authProxy = (0, express_http_proxy_1.default)("http://localhost:3001", {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/auth", "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = srcReq.user;
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        // Pass authenticated user information
        if (user === null || user === void 0 ? void 0 : user.userId) {
            proxyReqOpts.headers["userid"] = user.userId;
        }
        if (user === null || user === void 0 ? void 0 : user.email) {
            proxyReqOpts.headers["email"] = user.email;
        }
        if (user === null || user === void 0 ? void 0 : user.role) {
            proxyReqOpts.headers["role"] = user.role;
        }
        console.log("Auth Proxy -> User:", user);
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res) => {
        console.error("Auth Proxy Error:", err.message);
        res.status(502).json({
            success: false,
            message: "Auth service is unavailable",
        });
    }
});
// ─── USER/PROFILE SERVICE PROXY (PORT 6000) ───────────────────────────
const userServiceProxy = (0, express_http_proxy_1.default)("http://localhost:6000", {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace("/api/v1/users", "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = srcReq.user;
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        // Pass down user identities decoded from authMiddleware
        // Note: HTTP headers are lowercased by Node.js — use "userid" consistently
        if (user === null || user === void 0 ? void 0 : user.userId) {
            proxyReqOpts.headers["userid"] = String(user.userId);
        }
        if (user === null || user === void 0 ? void 0 : user.email) {
            proxyReqOpts.headers["email"] = user.email;
        }
        if (user === null || user === void 0 ? void 0 : user.role) {
            proxyReqOpts.headers["role"] = user.role;
        }
        console.log("USER id sent to User Service: ", user === null || user === void 0 ? void 0 : user.userId);
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
        console.error("User Proxy Error: ", err.message);
        res.status(502).json({
            success: false,
            message: "User service is unavailable",
        });
    }
});
// ─── BOOKING SERVICE PROXY (PORT 7001) ────────────────────────────────
const bookingServiceUrl = process.env.BOOKING_SERVICE_URL || "http://localhost:7001";
const bookingServiceProxy = (0, express_http_proxy_1.default)(bookingServiceUrl, {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/api\/v1\/bookings?/, "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const user = srcReq.user;
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        if (user === null || user === void 0 ? void 0 : user.userId) {
            proxyReqOpts.headers["userid"] = String(user.userId);
        }
        if (user === null || user === void 0 ? void 0 : user.email) {
            proxyReqOpts.headers["email"] = user.email;
        }
        if (user === null || user === void 0 ? void 0 : user.role) {
            proxyReqOpts.headers["role"] = user.role;
        }
        console.log("Booking Proxy -> User:", user);
        return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
        console.error("Booking Proxy Error: ", err.message);
        res.status(502).json({
            success: false,
            message: "Booking service is unavailable",
        });
    }
});
// ─── ROUTES DEFINITION ────────────────────────────────────────────────
// 1. Protected Auth Routes (Require Token Validation)
app.use("/api/v1/auth/update-password", auth_middleware_1.authMiddleware, authProxy);
// 2. Public Auth Routes (Login, Register, etc.)
app.use("/api/v1/auth", authProxy);
// 3. User Service Routes (Mapped distinctly to avoid being swallowed by authProxy)
// Added authMiddleware here assuming user profiles are protected endpoints
app.use("/api/v1/users", auth_middleware_1.authMiddleware, userServiceProxy);
// 4. Booking Service Routes
app.use("/api/v1/booking", auth_middleware_1.authMiddleware, bookingServiceProxy);
app.use("/api/v1/bookings", auth_middleware_1.authMiddleware, bookingServiceProxy);
// ─── APP INITIALIZATION ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Api gateway is successfully running on PORT ${PORT}`);
});
