import app from "./app";

import { dbConnect } from "./config/db.config";
import { rabbitMQConnect } from "./config/rabbitMQ.config";
const PORT= process.env.PORT;


const startServer = async()=>{
await dbConnect();
await rabbitMQConnect();

    app.listen(PORT,()=>{
    console.log(`Booking service is successfully running on PORT ${PORT}`)
})
}


startServer();