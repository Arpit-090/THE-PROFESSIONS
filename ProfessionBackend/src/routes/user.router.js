import { Router } from "express";
import {
    getUser,
    logInUser,
    logOutUser,
    registerUser,
    changeUserPassword,
    refreshAccessToken,
    allMessages,
    fetchChats,
    accessChat,
    sendMessage,
    getUsersWithSameInterests,
    updateUserInterests,
    deleteUser,
    deleteUserInterests
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVarify } from "../middlewares/auth.middleware.js";
const router = Router()

router.route('/get').get(getUser)
router.route("/register").post
    (upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ])          // this is the multer middleware used to upload files{upload}
        , registerUser)
/*router.route("/register")||.post(||upload.feilds([])||,registeruser) 
    for routing     ||post method || middleware       || method when route is on register   */

router.route("/login").post(logInUser)

//secured routes means rotes used when user is authenticated or logged in

router.route("/logout").post(jwtVarify, logOutUser)
router.route("/refresh-Token").post(refreshAccessToken)
// change current password 
router.route("/changePassword").post(jwtVarify, changeUserPassword)

////////////////////// routes for chats ///////////////////////////

router.route("/all-chats").get(jwtVarify, fetchChats)
router.route("/chat").post(jwtVarify, accessChat)
router.route("/sendMsg").post(jwtVarify, sendMessage)
router.route("/getMsg/:chatId").get(jwtVarify, allMessages)
// route for getting same interest users
router.route("/same-interests").get( jwtVarify,getUsersWithSameInterests)
//route for update and delete users interests
router.route("/delete-interests").post(jwtVarify, deleteUserInterests)
router.route("/update-interests").post(jwtVarify, updateUserInterests)
/////////////////////// route for deleting the user Account//
router.route("/delete-Account").get(jwtVarify, deleteUser)
export default router;