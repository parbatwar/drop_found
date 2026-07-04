import axios from 'axios';

/**
 * Uploads a raw file object directly to Cloudinary using unauthenticated unsigned presets.
 * Direct raw axios instance is retained here intentionally to bypass local backend token interceptors.
 * 
 * @param {File} file - Raw File object from input collection field
 * @returns {Promise<string>} Secure URL string of completed asset injection
 */

export const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error("Missing Cloudinary storage configuration profiles.");
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
    );
    
    return res.data.secure_url;
};