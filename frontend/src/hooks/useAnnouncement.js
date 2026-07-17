// hooks/useAnnouncement.js
import { useState, useEffect } from 'react';
import { getActiveAnnouncements } from '../api/announcement';

export const useAnnouncement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await getActiveAnnouncements();
                setAnnouncements(res.data || []);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
                setAnnouncements([]); // ✅ Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return { announcements, loading };
};