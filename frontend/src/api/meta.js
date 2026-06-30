import apiClient from './client';

export const getListingOptions = () => apiClient.get('/meta/listing-options');