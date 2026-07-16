
// There are three ways for accessing token[body,header,cookie] and we are using header for accessing token in this project.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //fetch token from header
        const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
        if (!token) {
            throw new AppError("No token provided", 401);
        }
        
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY ?? "default_secret");

        req.user=decoded; // Attach the decoded token payload to the request object for further use in the route handlers
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        next(error);
    }
}