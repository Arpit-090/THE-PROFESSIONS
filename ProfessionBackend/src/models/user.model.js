import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         index: true  // an good option for make it searchable
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      fullname: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         index: true  // an good option for make it searchable
      },
      bio: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         index: true  // an good option for make it searchable
      },
      avatar: {
         type: String, //claodinay url
         required: true,
      },
      coverImage: {
         type: String,
         required: true,
      },
      interests: [
         {
            type: String,
         },
      ],
      password: {
         type: String,
         required: [true, "needed a password"]
      },
      refreshtoken: {
         type: String
      },
   }, { timestamps: true }
)
// pre is a function by mongoose work as middleware help to run a func before any work i.e. 
// in this pre we want to run pre before save
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10)
   next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)   //compare function to check the password 
}
userSchema.methods.generateAccessToken = function () {
   return jwt.sign({
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname
   },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

userSchema.methods.generateRefreshToken = function () {
   return jwt.sign({
      _id: this._id,
   },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}
export const User = mongoose.model("User", userSchema)