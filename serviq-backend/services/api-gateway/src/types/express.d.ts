import {JwtPayload} from 'jsonwebtoken';
declare global{
    namespace Express {
        interface Request {
            user?: string | JwtPayload; // Adjust the type according to your user object structure
        }
    }
}
export {};