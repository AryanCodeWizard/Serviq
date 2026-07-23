import app from "./app";
import { dbConnect } from "./config/db.config";
import { rabbitMQConnect } from "./config/rabbitMQ.config";
import { profileConsumer } from "./consumer/profileConsumer";
const PORT= process.env.PORT;


const startServer = async()=>{
    await dbConnect();
    await rabbitMQConnect();
    await profileConsumer();

    app.listen(PORT,()=>{
    console.log(`User service is successfully running on PORT ${PORT}`)
})
}


startServer();