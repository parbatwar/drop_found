import apiClient from './client';

export const getListingOptions = () => apiClient.get('/meta/listing-options');
export const getSellerOptions = () => apiClient.get('/meta/seller-options');