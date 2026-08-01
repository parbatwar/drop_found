/**
 * @file orderUtils.js
 * @description Utility functions for processing, formatting, and deriving values from order data, 
 * including extracting images and titles, calculating item counts, formatting dates and IDs, 
 * and evaluating order status permissions.
 */

import { ORDER_STATUS } from '../constants/orderStatus';

// Get the first image URL from an order
export const getOrderImageUrl = (order) => {
    return order?.items?.[0]?.listing?.images?.[0]?.image_url || null;
};

// Get the title of the first item in an order
export const getOrderTitle = (order) => {
    return order?.items?.[0]?.listing?.title || 'Product';
};

// Get total item count in an order
export const getOrderItemCount = (order) => {
    return order?.items?.length || 0;
};

// Check if an order can be cancelled (buyer)
export const canCancelOrder = (status) => {
    return status === ORDER_STATUS.PENDING || status === ORDER_STATUS.ACCEPTED;
};

// Check if an order can be reviewed
export const canReviewOrder = (status) => {
    return status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.COMPLETED;
};

// Get seller name from order
export const getOrderSellerName = (order) => {
    return order?.seller?.shop_name || 'Unknown Shop';
};

// Format order date
export const formatOrderDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Format order ID (first 8 chars)
export const formatOrderId = (id) => {
    return id?.slice(0, 8).toUpperCase() || 'N/A';
};