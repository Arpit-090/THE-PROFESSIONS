import asynchandler from "../utilities/asynchandler.js"
import { ApiError } from "../utilities/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utilities/claudinaryService.js"
import { ApiRisponse } from "../utilities/ApiRisponse.js"
import { error } from "console"
import jwt from "jsonwebtoken"
import {Chat} from "../models/chat.js"
import {Message} from "../models/message.js"
import {Community} from "../models/community.js"



// const generateAccessTokenAndRefreshTocken = async(userId)=>{
//   try {
//     const user = await User.findById(userId)
//     console.log("we are inside generateacessandreftreshtoken")
//     const AccessToken = user.generateAccessToken()
//     const RefreshToken = user.generateRefreshToken()

//     user.refreshtoken=RefreshToken
//     await user.save({validateBeforeSave:false})

//     return {AccessToken,RefreshToken}
//   } catch (error) {
//     console.log("filed to generate access and refresh token")
//     throw new ApiError(500,"failed to generate Acess Token and Refresh Token")
//   }
// }
const generateAccessTokenAndRefreshTocken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    console.log('we are inside generateAccessTokenAndRefreshToken');
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Failed to generate access and refresh token:', error);
    throw new ApiError(500, 'Failed to generate Access Token and Refresh Token');
  }
};
//get users for testing
const getUser = asynchandler(async(req , res)=>{
   const foundUsers =await User.find({}) 
  res.json(new ApiRisponse(200,{foundUsers},foundUsers))
  ;
})
// register function
const registerUser = asynchandler(async (req, res) => {

  // get user detail from frontend
  const { fullname, username, email, password,bio,interests } = req.body
  console.log(username, "email: ", email)
  // validation check what are the required data acoording to our data models
  if (username === "") {
    throw new ApiError(400, "please enter the username");
  }
  if (fullname === "") {
    throw new ApiError(400, "please enter the fullname");
  }
  if (email === "") {
    throw new ApiError(400, "please enter the email");
  }
  if (bio === "") {
    throw new ApiError(400, "please enter the email");
  }
  if (interests === "") {
    throw new ApiError(400, "please enter the email");
  }
  if (password === "") {
    throw new ApiError(400, "please enter the password");
  }
  // check if user is already exists or not
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (existingUser) {
    throw new ApiError(409, "username or email already exists")
  }

  console.log(password);

  // check for required images and avatars
  const avatarLocalPath = req.files?.avatar?.[0]?.path ?? null;
  const coverImgLocalPath = req.files?.coverImage?.[0]?.path ?? null;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatarpath is required");
  } else {
    console.log("local path ctreated");
  }
  console.log(avatarLocalPath);
  if (!coverImgLocalPath) {
    throw new ApiError(400, "coverImagepath is required");
  } else {
    console.log("local path ctreated");
  }
  console.log(coverImgLocalPath);

  const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : console.log("filed to upload avatar");
  const coverImage = coverImgLocalPath ? await uploadOnCloudinary(coverImgLocalPath) : null
  // check all are uploaded to cloudinary , avatar
  //  const avatar = await uploadOnCloudinary(avatarLocalPath)
  //  const coverImage = await uploadOnCloudinary(coverImgLocalPath)

  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }
  if (!coverImage) {
    throw new ApiError(400, "coverImage is required");
  }

  // create the user-create entry in bd

  const user = await User.create({
    fullname,
    username,
    email,
    password,
    bio,
    interests,

    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  })

  // remove the password and the refresh token from the risponse of cloudinay bcs we have not to show it to user
  const createduser = await User.findById(user._id).select(
    "-password -refreshtoken"
  )

  // check for user is created 
  if (!createduser) {
    throw new ApiError(500, "something went wrong in regestration or in creating user");

  }

  // if yes return risponse else throw error 
  return res.status(201).json(
    new ApiRisponse(200, createduser, "User is registred successfully")
  )
})
// login function
const logInUser = asynchandler(async (req, res) => {
  console.log("we are inside te login function")
  const { username = '', email = '', password = '' } = req.body        // taking data from request
  console.log(req.body)
  console.log("hello working")
  if (!username.trim() && !email.trim()) {
    console.log("inside checking")                       // checking that there is email or username in the request body
    throw new ApiError(400, "username or email is required")
  }
  const user = await User.findOne({
    $or: [{ username }, { email }]     // find either email or username 
  })
  if (!user) {
    throw new ApiError(404, "user doesn't exists")
  }
  // checking users password
  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(404, "unvalide user-password please enter a correct password ")
  }
  // taking acessTocken and refresh tocken
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTocken(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiRisponse(200, {
        user: loggedInUser, accessToken, refreshToken
      }, "succesfully logged in")
    )
})
// refreshing the access Token
const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unable to refresh accessToken")
  }
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(decodedToken?._id)
  if (!user) {
    throw new ApiError(401, "invalid refreshToken")
  }

  if (incomingRefreshToken !== user.refreshtoken) {
    throw new ApiError(401, "refresh token are expired or used ")
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTocken(user._id)
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiRisponse(200, { accessToken, refreshToken }, "succesfully created new tokens"))

})
// logout function
const logOutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.body._id,
    {
      $set: { refreshtoken: undefined }
    },
    { new: true }
  )
  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRisponse(200, {}, "user succesfully logged Out"))
})
// change password function 
const changeUserPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;  // will be hashed in pre-save hook
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiRisponse(200, {}, "Password successfully changed")
  );
});

// function to get the current user
const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "fetched the logged in user")
})
// updating user information
const updateUserinformation = asynchandler(async (req, res) => {
  const { fullname, email } = req.body

  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        fullname,
        email
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiRisponse(200, user, "user detailes updated successfully"))
})

const updateAvatar = asynchandler(async (req, res) => {
  const { avatarFilePath } = req.file?.path
  if (!avatarFilePath) {
    throw new ApiError(400, "please give a file to update")
  }
  const avatar = await uploadOnCloudinary(avatarFilePath)
  if (!avatar.url) {
    throw new ApiError(400, "failed to upload avatar in cloudirnary")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")
  return res
    .status(200)
    .json(new ApiRisponse(200, user, "successfully updated the avatar image"))
})


const updateCoverImage = asynchandler(async (req, res) => {
  const { BackgroundFilePath } = req.file?.path
  if (!BackgroundFilePath) {
    throw new ApiError(400, "please give a file to update")
  }
  const coverImage = await uploadOnCloudinary(BackgroundFilePath)
  if (!coverImage.url) {
    throw new ApiError(400, "failed to upload coverImg in cloudirnary")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    { new: true }
  ).select("-password")
  return res
    .status(200)
    .json(new ApiRisponse(200, user, "successfully updated the cover image"))
})

// const getUserChannelProfie = asynchandler(async (req, res) => {
//   const { username } = req.params

//   if (!username?.trim) {
//     throw new ApiError(400, "username is missing")
//   }

//   const channel = await User.aggregate([
//     {
//       $match: {
//         username: username?.toLowerCase(),
//       }
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "channel",
//         as: "subscribers"
//       }
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "subscriber",
//         as: "subscribedTo"
//       }
//     },
//     {
//       $addFields: {
//         subscriberCount: {
//           $size: "$subscribers"
//         },
//         subscribedToCount: {
//           $size: "$subscribedTo"
//         },
//         isSubscribed: {
//           $cond: {
//             $if: { $in: [req.user?._id, "$subscribers.subscriber"] },
//             $then: true,
//             $else: false
//           }
//         }
//       }
//     },
//     {
//       $project:{
//         fullname: 1,
//         username: 1,
//         email: 1,
//         avatar: 1,
//         coverImage: 1,
//         subscriberCount: 1,
//         subscribedToCount: 1
//       }
//     }
//   ])
//   if (!channel?.length){
//     throw new ApiError(400,"channel does't exists")
//   }

//   return res.status(200)
//   .json(new ApiRisponse(200,channel[0],"channel fetched successfull"))
// })
//////////////////////////////////// CHAT METHODS ///////////////////////////////////////

// finding old and creating new chats
// chat bt two peoples{only fethching chats}
const accessChat = asynchandler(async(req,res)=>{
  const {userId} = req.body
  if(!userId){
    throw new ApiError(401,"unable to get userID")
  }
   // finding old chats

    try {
      let chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [req.user._id, userId] },
      })
        .populate("users", "-password -refreshtoken")
        .populate("latestMessage");
        if (chat) return res.json(new ApiRisponse(200,{chat},"fethed old chats"))
      // if not found old created new chats
           const newChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const fullChat = await Chat.findById(newChat._id).populate(
        "users",
        "-password -refreshtoken"
      );
      res.status(401)
      .json(new ApiRisponse(400,{fullChat},"access of full chats"))
    } catch (error) {
      res.status(500)
      .json(new ApiError(500,"failed on accessChat function"))
      
    }
  
})

// for community chats (inly fetching chats)

const fetchChats = asynchandler(async(req,res)=>{
   try {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password -refreshtoken")
      .populate("groupAdmin", "-password -refreshtoken")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.json(new ApiRisponse(200,{chats},"successfully fetched the chats"));
  } catch (error) {
    res.status(400).json(new ApiError(400,"failed in fetch chats"));
  }
})

////////////////////////// finding user with same interests //////////////////
 const getUsersWithSameInterests = asynchandler(async (req, res) => {
  try {

    console.log("here is the errrrrrrrrrrrrrorrrrrrrrrrrrrrrrrrrrr",req.user);
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser) {
      throw new ApiError(404, "User not found");
    }

    const userInterests = loggedInUser.interests;
    if (!userInterests || userInterests.length === 0) {
      return res
        .status(200)
        .json(new ApiRisponse(200, [], "No interests found for user"));
    }

    // 🔹 Aggregation Pipeline
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUser._id }, // Exclude current user
          interests: { $in: userInterests }, // Match users with at least one same interest
        },
      },
      {
        $project: {
          _id:1,
          password: 0,
          refreshtoken: 0,
        },
      },
      {
        $addFields: {
          commonInterests: {
            $setIntersection: ["$interests", userInterests],
          },
        },
      },
      {
        $sort: {
          "commonInterests.length": -1, // Sort by most interests in common
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiRisponse(200, users, "Users with similar interests found"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch users");
  }
});
// update interest feild
 const updateUserInterests = asynchandler(async (req, res) => {
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests) || interests.length === 0) {
      throw new ApiError(400, "Please provide at least one interest in an array");
    }

    // find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { interests } },
      { new: true, runValidators: true }
    ).select("-password -refreshtoken");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res
      .status(200)
      .json(new ApiRisponse(200, updatedUser, "Interests updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update interests");
  }
});
//delete interests feilds
const deleteUserInterests = asynchandler(async(req,res)=>{
  const user = req.user._id
  if(!user){
    throw new ApiError(400,"please login first")
  }
  const updatedUser = await User.findByIdAndUpdate(user,
        { $set: { interests: [] } }, // empty the array
      { new: true }
    ).select("-password -refreshtoken");
   if(!updatedUser){
    throw new ApiError(400,"unable to find user")
   }
   res.status(200).
   json(new ApiRisponse(200,"all interests feild deleted sucessfully"))
})



/////////////////////////////////// SENDING MESSAGES ///////////////////////////////////
// send msg
const sendMessage = asynchandler(async(req,res)=>{
  const {content , chatId} = req.body
  if(!content || !chatId){
    throw new ApiError(401,"invalid data and chatid")
  }

  try {
    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await message.populate("sender", "username fullname avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username fullname email avatar",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(new ApiRisponse(200,{message},"sent message successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(401,"unable to send message fault in function"));
  }
})


// ✅ Get all messages for a chat
 const allMessages = asynchandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username fullname avatar email")
      .populate("chat");

    res.status(200)
    .json(new ApiRisponse(200,{messages},"successfully sent all messages"));
  } catch (error) {
    throw new ApiError(400,"failed to fetch all achats in allmesg function")
  }
});

//////////////////////////////////////// for deleting users account ////////////////////////////
const deleteUser =asynchandler( async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      throw new ApiError(400,"can't find user")
    }

    res.status(200).json(new ApiRisponse(200,"User accounted deleted sucessfull"));
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export {
  registerUser, logInUser, logOutUser, changeUserPassword,
  getCurrentUser, refreshAccessToken, updateUserinformation,
  updateCoverImage, updateAvatar,getUser,updateUserInterests,
  allMessages,sendMessage,fetchChats,accessChat,getUsersWithSameInterests
  ,deleteUser,deleteUserInterests
}