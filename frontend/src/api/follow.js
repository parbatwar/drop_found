import apiClient from "./client";

export const getFollowing = () =>
    apiClient.get("/follows");

export const followSeller = (sellerId) =>
    apiClient.post("/follows", {
        seller_id: sellerId,
    });

export const unfollowSeller = (sellerId) =>
    apiClient.delete(`/follows/${sellerId}`);