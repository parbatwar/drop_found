// api/announcement.js
import apiClient from './client';

// Public
export const getActiveAnnouncements = () => apiClient.get('/announcements/active');

// Admin
export const getAllAnnouncements = () => apiClient.get('/announcements');
export const createAnnouncement = (data) => apiClient.post('/announcements', data);
export const updateAnnouncement = (id, data) => apiClient.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => apiClient.delete(`/announcements/${id}`);