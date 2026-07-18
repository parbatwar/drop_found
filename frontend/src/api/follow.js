import apiClient from "./client";

export const followSeller = (sellerId) =>
    apiClient.post("/follows", {
        seller_id: sellerId,
    });

export const unfollowSeller = (sellerId) =>
    apiClient.delete(`/follows/${sellerId}`);

export const getSellerFollowers = (sellerId) => 
    apiClient.get(`/follows/sellers/${sellerId}/followers`);

export const getFollowing = () =>
    apiClient.get("/follows");
