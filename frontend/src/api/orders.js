import apiClient from './client';

export const checkoutCart = (data) => apiClient.post('/orders/checkout', data);
export const quickBuy = (data) => apiClient.post('/orders/quick-buy', data);
export const getMyOrders = () => apiClient.get('/orders/me');
export const getSellerOrders = () => apiClient.get('/orders/seller');
export const updateOrderStatus = (id, data) => apiClient.put(`/orders/${id}/status`, data);