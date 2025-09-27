import { ApiError } from "../utilities/ApiError.js";
import asynchandler from "../utilities/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const jwtVarify = asynchandler(async(req,res,next)=>{
   try {
    const token= req.cookies?.accessToken || req.header("Authorization")
   //  acessToken from acesstoken
      // console.log("this is req",req)
      // console.log("this is req header", req.header)
      // console.log("this is ", token)
    if(!token){
     throw new ApiError(401,"unauthorized request")
    }
   const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
    if(!user){
     throw new ApiError(401,"inavlide Accesstoken")
    }
    req.user = user
    next()
   } catch (error) {
    throw new ApiError(401,error?.msg,"invalide Accesstoken")
   }
})