import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fsPromises, existsSync } from 'fs';

dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary configuration in environment variables');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {        
        if (!localFilePath || !existsSync(localFilePath)) {
            console.error('Invalid or missing file path');
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        await fsPromises.unlink(localFilePath); // Asynchronous file deletion
        return response;
    } catch (error) {
        if (localFilePath && existsSync(localFilePath)) {
            await fsPromises.unlink(localFilePath); // Asynchronous file deletion
        }
        console.error('Error uploading to Cloudinary:', error.message);
        return null; // Explicitly return a fallback value
    }
};

export { uploadOnCloudinary };
