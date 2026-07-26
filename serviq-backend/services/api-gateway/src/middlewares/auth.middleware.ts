
// There are three ways for accessing token[body,header,cookie] and we are using header for accessing token in this project.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // fetch token from header (Bearer <token>) or cookie
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith("Bearer ")) 
            ? authHeader.split(" ")[1] 
            : (req.cookies?.token || (authHeader ? authHeader : undefined));

        if (!token) {
            throw new AppError("No token provided", 401);
        }
        
        // verify the token using configured secrets
        const secret = process.env.JWT_SECRET_KEY || process.env.ACCESS_TOKEN_JWT_SECRET || "aryan";
        const decoded = jwt.verify(token, secret);
        console.log("Decoded token value: ", decoded);

        req.user = decoded; // Attach the decoded token payload to the request object
        next();
    }
    catch (error) {
        next(error);
    }
}