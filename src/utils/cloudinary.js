import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath)return null;
        // upload file on cloudinary
       const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        // console.log("file has been uploaded on cloudinary ",responce.url);
        return responce;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the loacally saved temp file as upload opertion got failed

    }
}



  export {uploadOnCloudinary}