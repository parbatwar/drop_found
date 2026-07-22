// api/auth.js - Authentication related API

import apiClient from './client';


export const loginUser = (data) => apiClient.post('/auth/login', data);

// Email/Password REGISTER - Disabled (new users must use Google)
// export const registerUser = (data) => apiClient.post('/auth/register', data);

// Google OAuth
export const getCurrentUser = () => apiClient.get('/auth/me');

// 🔜 Future: Email verification endpoints (will be uncommented later in Phase 2)
/*
export const verifyEmail = (token) => apiClient.get(`/auth/verify-email?token=${token}`);
export const resendVerification = () => apiClient.post('/auth/resend-verification');
export const checkVerification = (email) => apiClient.post('/auth/check-verification', { email });
*/