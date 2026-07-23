// frontend/src/api/seller.js
import apiClient from './client';

export const getSellers = () => apiClient.get('/sellers/');
export const applySeller = (data) => apiClient.post('/sellers/apply', data);
export const getMySellerProfile = () => apiClient.get('/sellers/me');
export const updateSellerProfile = async (data) => {
    try {
        const response = await apiClient.put('/sellers/me', data);
        return response.data;
    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        throw error;
    }
};
export const getSeller = (slug) => apiClient.get(`/sellers/${slug}`);

// ✅ New: Get verification status
export const getVerificationStatus = () => apiClient.get('/sellers/verification/status');

// ✅ New: Get pending sellers for admin
export const getPendingSellers = () => apiClient.get('/admin/sellers/pending');

// ✅ New: Review seller (admin)
export const reviewSeller = (sellerId, data) => 
    apiClient.patch(`/admin/sellers/${sellerId}/review`, data);