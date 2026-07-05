import apiClient from './client';

export const createOrder = (data) => apiClient.post('/orders/', data);
export const getMyOrders = () => apiClient.get('/orders/me');
export const getSellerOrders = () => apiClient.get('/orders/seller');
export const updateOrderStatus = (id, data) => apiClient.put(`/orders/${id}/status`, data);