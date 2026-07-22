// frontend/src/api/orders.js
import apiClient from './client';

// ─── Buyer Endpoints ───

export const checkoutCart = (data) => apiClient.post('/orders/checkout', data);
export const quickBuy = (data) => apiClient.post('/orders/quick-buy', data);

// Get all orders (individual - keep for backward compatibility)
export const getMyOrders = () => apiClient.get('/orders/me');

// ✅ NEW: Get all order groups (grouped by checkout)
export const getMyOrderGroups = () => apiClient.get('/orders/groups/me');

// Get a specific order
export const getMyOrder = (orderId) => apiClient.get(`/orders/me/${orderId}`);


// Get a specific order group
export const getOrderGroup = (orderGroupId) => apiClient.get(`/orders/group/${orderGroupId}`);

// ─── Seller Endpoints ───
export const getSellerOrders = (params = {}) => apiClient.get('/orders/seller', { params });
export const updateOrderStatus = (id, data) => apiClient.put(`/orders/${id}/status`, data);

// ─── Admin Endpoints ───
export const getAllOrders = (params = {}) => apiClient.get('/orders/admin/all', { params });
export const getOrderById = (orderId) => apiClient.get(`/orders/admin/${orderId}`);
export const completeOrder = (orderId) => apiClient.put(`/orders/admin/${orderId}/complete`);
export const adminUpdateOrderStatus = (orderId, data) => apiClient.put(`/orders/admin/${orderId}/status`, data);
export const getOrderStats = () => apiClient.get('/orders/admin/stats');