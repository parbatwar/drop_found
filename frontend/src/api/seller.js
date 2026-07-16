import apiClient from './client';

export const getSellers = () => apiClient.get('/sellers/');
export const applySeller = (data) => apiClient.post('/sellers/apply', data);
export const getMySellerProfile = () => apiClient.get('/sellers/me');
export const updateSellerProfile = async (data) => {
    try {
        // ✅ Use apiClient instead of api
        const response = await apiClient.put('/sellers/me', data);
        return response.data;
    } catch (error) {
        // ✅ Log the full error
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

