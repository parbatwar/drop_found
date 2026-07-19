// api/orders.js
import apiClient from './client';

// ─── Buyer Endpoints ───

/**
 * Checkout entire cart
 */
export const checkoutCart = (data) => apiClient.post('/orders/checkout', data);

/**
 * Quick buy a single item (bypasses cart)
 */
export const quickBuy = (data) => apiClient.post('/orders/quick-buy', data);

/**
 * Get all orders for the current buyer
 */
export const getMyOrders = () => apiClient.get('/orders/me');

/**
 * Get a specific order for the current buyer
 * @param {string} orderId - The order ID
 */
export const getMyOrder = (orderId) => apiClient.get(`/orders/me/${orderId}`);

/**
 * Get an order group with all its orders
 * @param {string} orderGroupId - The order group ID
 */
export const getOrderGroup = (orderGroupId) => apiClient.get(`/orders/group/${orderGroupId}`);


// ─── Seller Endpoints ───

/**
 * Get all orders for the current seller
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (pending, accepted, etc.)
 */
export const getSellerOrders = (params = {}) => apiClient.get('/orders/seller', { params });

/**
 * Update order status (seller)
 * @param {string} id - Order ID
 * @param {Object} data - { status: 'accepted' | 'rejected' | 'ready_for_pickup' | 'cancelled' }
 */
export const updateOrderStatus = (id, data) => apiClient.put(`/orders/${id}/status`, data);


// ─── Admin Endpoints ───

/**
 * Get all orders for admin (with pagination and status filter)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Items per page
 * @param {number} params.offset - Pagination offset
 */
export const getAllOrders = (params = {}) => apiClient.get('/orders/admin/all', { params });

/**
 * Get a specific order by ID (admin only)
 * @param {string} orderId - The order ID
 */
export const getOrderById = (orderId) => apiClient.get(`/orders/admin/${orderId}`);

/**
 * Manually complete an order (admin only)
 * @param {string} orderId - The order ID
 */
export const completeOrder = (orderId) => apiClient.put(`/orders/admin/${orderId}/complete`);

/**
 * Force update any order status (admin only)
 * @param {string} orderId - The order ID
 * @param {Object} data - { status: '...' }
 */
export const adminUpdateOrderStatus = (orderId, data) => 
    apiClient.put(`/orders/admin/${orderId}/status`, data);

/**
 * Get order statistics for admin dashboard
 */
export const getOrderStats = () => apiClient.get('/orders/admin/stats');