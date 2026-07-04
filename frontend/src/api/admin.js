// src/api/admin.js
import API from "./client"; // Assuming your base Axios instance setup is here

/**
 * Fetches all pending seller applications awaiting review.
 */
export const getPendingSellers = () => API.get('/admin/sellers/pending');

/**
 * Updates a specific seller profile application status (approve/reject).
 * @param {number|string} sellerId - Target merchant primary key identifier
 * @param {string} status - New target status ('active' or 'rejected')
 */
export const reviewSellerApplication = (sellerId, status) => 
    API.patch(`/admin/sellers/${sellerId}/review`, { status });