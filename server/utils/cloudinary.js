import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "D:/Mayank Data/CODING/RideMate/server/.env" })


console.log("Cloud Name: ", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY: ", process.env.CLOUDINARY_API_KEY);
console.log("SECRET: ", process.env.CLOUDINARY_API_SECRET);


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;