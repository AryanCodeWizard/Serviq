import mongoose from 'mongoose';

export const dbConnect = async (): Promise<void> => {
    try {
        // const MONGODB_URL = process.env.MONGODB_URL as string;
        // const MONGODB_URL = process.env.MONGODB_URL!;

        const MONGODB_URL = process.env.MONGODB_URL;

        if (!MONGODB_URL) {
            console.log("MONGODB_URL not found");
            process.exit(1);
        }
        mongoose.connect(MONGODB_URL);
        console.log("Auth Service is successfully connected to DB");

    }
    catch (error: any) {

        if (error instanceof Error) {
            console.log("Auth Service DB connection failed", error.message);
            process.exit(1);
        }
        else {
            console.log("Auth Service DB connection failed due to some unknown error", error);
            process.exit(1);
        }



    }
}