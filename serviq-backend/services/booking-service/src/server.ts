import app from "./app";

import { dbConnect } from "./config/db.config";
const PORT= process.env.PORT;


const startServer = async()=>{
dbConnect();

    app.listen(PORT,()=>{
    console.log(`Booking service is successfully running on PORT ${PORT}`)
})
}


startServer();