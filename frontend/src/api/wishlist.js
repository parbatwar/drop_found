import apiClient from "./client";

export const getWishlist = () => apiClient.get("/wishlist");

export const addToWishlist = (listingId) =>
  apiClient.post("/wishlist", {
    listing_id: listingId,
  });

export const removeFromWishlist = (listingId) =>
  apiClient.delete(`/wishlist/listing/${listingId}`);