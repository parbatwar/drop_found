// frontend/src/utils/uploadToCloudinary.js
import axios from 'axios';

/**
 * Uploads a file to Cloudinary using unsigned presets.
 * Supports both images and documents (PDF, etc.)
 * 
 * @param {File} file - Raw File object
 * @param {Object} options - Upload options
 * @param {string} options.folder - Folder to store in (e.g., 'listings', 'documents', 'logos')
 * @param {boolean} options.isDocument - Whether this is a document (PDF, etc.)
 * @returns {Promise<string>} Secure URL string of completed upload
 */

export const uploadToCloudinary = async (file, options = {}) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const { folder = '', isDocument = false } = options;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error("Missing Cloudinary storage configuration profiles.");
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    
    // ✅ Add folder if specified
    if (folder) {
        data.append('folder', folder);
    }

    // ✅ For documents, allow PDF uploads
    if (isDocument) {
        // Cloudinary can handle PDFs as well
        data.append('resource_type', 'auto');
    }

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    
    return res.data.secure_url;
};

