import apiClient from "./client";

export const createReview = (orderId, data) =>
    apiClient.post(`/reviews/order/${orderId}`, data);

export const getSellerReviews = (sellerId) =>
    apiClient.get(`/reviews/seller/${sellerId}`);