import apiClient from './client';

export const getSellers = () => apiClient.get('/sellers/');
export const applySeller = (data) => apiClient.post('/sellers/apply', data);
export const getMySellerProfile = () => apiClient.get('/sellers/me');
export const getSellerBySlug = (slug) => apiClient.get(`/sellers/${slug}`);

