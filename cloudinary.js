import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fsPromises, existsSync } from 'fs';

dotenv.config();

// Ensure Cloudinary configuration is present
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration is missing in environment variables');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary and deletes the local file.
 * @param {string} localFilePath - The path to the local file to be uploaded.
 * @returns {object|null} The Cloudinary upload response, or null if an error occurred.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Validate the file path
        if (!localFilePath || !existsSync(localFilePath)) {
            console.error('Error: Invalid or missing file path');
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        // Asynchronously delete the local file after upload
        await fsPromises.unlink(localFilePath);

        return response;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error.message);

        // Attempt to delete the file if it exists
        if (localFilePath && existsSync(localFilePath)) {
            try {
                await fsPromises.unlink(localFilePath);
            } catch (unlinkError) {
                console.error('Error deleting local file:', unlinkError.message);
            }
        }

        return null;
    }
};

export { uploadOnCloudinary };
