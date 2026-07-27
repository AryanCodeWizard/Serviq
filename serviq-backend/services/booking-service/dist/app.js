"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
// import router from './routes/user.route';
dotenv_1.default.config();
const app = (0, express_1.default)();
// also add error midllware in future
// 1. THIS LINE MUST BE PRESENT AND PLACE BEFORE YOUR ROUTES
app.use(express_1.default.json());
// 2. Optional: If you send data via URL-encoded forms from Postman
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", booking_routes_1.default);
exports.default = app;
