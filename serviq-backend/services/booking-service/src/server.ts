import app from "./app";

const PORT= process.env.PORT;


const startServer = async()=>{


    app.listen(PORT,()=>{
    console.log(`Booking service is successfully running on PORT ${PORT}`)
})
}


startServer();