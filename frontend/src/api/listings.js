import apiClient from './client';

export const getSellerListings = (sellerId) =>
    apiClient.get(`/listings/seller/${sellerId}`);

export const getListings = (params = {}) =>
  apiClient.get("/listings", {
    params,
  });
export const getListing = (id) => apiClient.get(`/listings/${id}`);
export const getMyListings = () => apiClient.get("/listings/me");

export const createListing = (data) => apiClient.post('/listings/', data);
export const updateListing = (id, data) => apiClient.patch(`/listings/${id}`, data);
export const deleteListing = (id) => apiClient.delete(`/listings/${id}`);