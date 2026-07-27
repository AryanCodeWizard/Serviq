"use strict";
// There are three ways for accessing token[body,header,cookie] and we are using header for accessing token in this project.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // fetch token from header (Bearer <token>) or cookie
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith("Bearer "))
            ? authHeader.split(" ")[1]
            : (((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || (authHeader ? authHeader : undefined));
        if (!token) {
            throw new appError_1.AppError("No token provided", 401);
        }
        // verify the token using configured secrets
        const secret = process.env.JWT_SECRET_KEY || process.env.ACCESS_TOKEN_JWT_SECRET || "aryan";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log("Decoded token value: ", decoded);
        req.user = decoded; // Attach the decoded token payload to the request object
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authMiddleware = authMiddleware;
