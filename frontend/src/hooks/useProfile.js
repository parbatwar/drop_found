// hooks/useProfile.js
import { useState, useEffect } from 'react';
import { updateProfile } from '../api/user';
import { getFollowing } from '../api/follow';
import { useAuth } from '../context/AuthContext';
import { useToast } from './useToast';

export const useProfile = () => {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [followingCount, setFollowingCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
    });

    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Fetch following count
    useEffect(() => {
        const fetchFollowingCount = async () => {
            try {
                const res = await getFollowing();
                setFollowingCount(res.data?.length || 0);
            } catch (err) {
                console.error('Failed to fetch following count:', err);
            } finally {
                setLoadingCount(false);
            }
        };
        fetchFollowingCount();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(formData);
            // Update user context with new data
            const updatedUser = { ...user, ...formData };
            // You might want to update the auth context here
            showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update error:', err);
            showToast(err.response?.data?.detail || 'Failed to update profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const getInitials = () => {
        if (!user) return '?';
        const first = user.first_name?.charAt(0) || '';
        const last = user.last_name?.charAt(0) || '';
        return (first + last).toUpperCase() || '?';
    };

    const isSeller = user?.role === 'seller' || user?.role === 'admin';

    return {
        user,
        isEditing,
        saving,
        followingCount,
        loadingCount,
        formData,
        isSeller,
        getInitials,
        handleChange,
        handleSave,
        handleLogout,
        setIsEditing,
    };
};