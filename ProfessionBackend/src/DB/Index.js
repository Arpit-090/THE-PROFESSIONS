import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

 const connectDB = async()=>{
 

try {


//    const connectionInstance = await mongoose.connect(MONGOBD_URI)
   const connectionInstance = await mongoose.connect(process.env.MONGOBD_URI)
//    const connectionInstance = await mongoose.connect(`mongodb+srv://ARPIT:aRPIT_09@cluster0.enjcp.mongodb.net/VideoTube`)
   console.log(`MONGO DATABASE HAS connected HOST :: ${connectionInstance.connection.host}`);
//    console.log(`MONRO DATABASE IS CONNECTED on PORT ${process.env.PORT}`);
   
} catch (error) {
    console.log("ERR: in connectDB fun" ,error);
 
    throw error
}
}

export  {connectDB}