// api/reviews.js
import apiClient from './client';

/**
 * Create a review for a completed order
 * @param {string} orderId - The order ID
 * @param {string} listingId - The listing ID
 * @param {Object} data - Review data
 * @param {number} data.rating - Rating from 1-5
 * @param {string} data.comment - Review comment (optional)
 * @returns {Promise} - The created review
 */
export const createReview = (orderId, listingId, data) => 
    apiClient.post(`/reviews/order/${orderId}/listing/${listingId}`, data);

/**
 * Get all reviews for a listing with pagination
 * @param {string} listingId - The listing ID
 * @param {Object} params - Pagination params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 50)
 * @returns {Promise} - Reviews response with pagination
 */
export const getListingReviews = (listingId, params = { page: 1, limit: 10 }) => 
    apiClient.get(`/reviews/listing/${listingId}`, { params });

/**
 * Get all reviews for a seller with pagination
 * @param {string} sellerId - The seller ID
 * @param {Object} params - Pagination params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 50)
 * @returns {Promise} - Reviews response with pagination
 */
export const getSellerReviews = (sellerId, params = { page: 1, limit: 10 }) => 
    apiClient.get(`/reviews/seller/${sellerId}`, { params });