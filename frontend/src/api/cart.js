import apiClient from './client';

export const getCart = () => apiClient.get('/cart');

export const addToCart = (data) =>
  apiClient.post('/cart/items', data);

export const updateCartItem = (itemId, data) =>
  apiClient.patch(`/cart/items/${itemId}`, data);

export const removeCartItem = (itemId) =>
  apiClient.delete(`/cart/items/${itemId}`);

export const clearCart = () =>
  apiClient.delete('/cart');