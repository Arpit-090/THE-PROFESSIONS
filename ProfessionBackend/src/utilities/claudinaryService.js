import {v2 as cloudinary} from "cloudinary"
// import { upload } from "../middlewares/multer.middleware.js";
import fs from "fs"



cloudinary.config({ 
  cloud_name:`dv19mgwcc`, 
  api_key: `396245278716926`, 
  api_secret:`tQ6uSLjO3xKHD1iPBQQ3j7Yj-9U` 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("failed to use uploadOnCloudinary function",error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}