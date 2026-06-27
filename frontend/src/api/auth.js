// Authentication related API

import apiClient from './client';

export const registerUser = (data) => apiClient.post('/auth/register', data);
export const loginUser = (data) => apiClient.post('/auth/login', data);
export const getCurrentUser = () => apiClient.get('/auth/me');