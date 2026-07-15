import apiClient from './client';

export const getCategories = () => apiClient.get('/categories');
export const getCategory = (id) => apiClient.get(`/categories/${id}`);
export const createCategory = (data) => apiClient.post('/categories', data);
export const updateCategory = (id, data) => apiClient.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);
