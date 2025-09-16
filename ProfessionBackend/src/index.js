import { app } from "./app.js";
import { connectDB } from "./DB/Index.js";
// import dotenv from "dotenv";
import 'dotenv/config';

// Load environment variables
// dotenv.config();


connectDB()
  .then(() => {
    const PORT =  3000;
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ MONGO db connection failed !!!", error);
  });



// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";
// const app = express()

// ;(async()=>
//     {
//         try {
//             await mongoose.connect(`${process.env.MONGODB_URN}/${DB_NAME}`)
//             app.on("error",(error) =>{
//                 console.log("ERRR:",error);
//                 throw error;
//             })
//             app.listen(process.env.PORT,()=>{
//                 console.log(`listining on port ${process.env.PORT}`)
//             })
//         } catch (error) {
//             console.log("ERROR:",error)
//                 throw error
//         }
//     }
// )()