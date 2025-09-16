import express from "express";
import cookieParser from "cookie-parser";
import cors from'cors'
import dotenv from "dotenv";

dotenv.config();


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,   //options of cors
    credentials: true
}))

app.use(express.json({
    limit: "16kb"   //options of express.json
} ))
// express.json takes the data from form and convert it to json and then send it to express app

app.use(express.urlencoded({
    limit:"16kb",
    extended:true 
}))   
// for handling the data comes through url and also encodede the url

app.use(express.static("public")) 
// for storing the pdf or files in your server

app.use(cookieParser())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing form data
 
// import routes

import userRouter from "./routes/user.router.js"

//routes decleration


app.use("/api/v1/users",userRouter)


export  {app}
