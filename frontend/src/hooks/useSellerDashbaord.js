// hooks/useSellerDashboard.js
import { useState, useEffect } from 'react';
import { getMySellerProfile } from '../api/seller';
import { getSellerListings } from '../api/listings';
import { getSellerOrders } from '../api/orders';
import { useToast } from './useToast';

export const useSellerDashboard = () => {
    const { showToast } = useToast();
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeListings: 0,
        totalOrders: 0,
        itemsSold: 0,
        followers: 0,
        rating: 0,
        reviews: 0
    });

    useEffect(() => {
        loadSellerData();
    }, []);

    const loadSellerData = async () => {
        try {
            // Get seller profile
            const sellerRes = await getMySellerProfile();
            const sellerData = sellerRes.data;
            setSeller(sellerData);

            // Get seller listings
            const listingsRes = await getSellerListings(sellerData.id);
            const listingsData = listingsRes.data || [];
            setListings(listingsData);

            // Get seller orders
            let ordersData = [];
            let itemsSold = 0;
            try {
                const ordersRes = await getSellerOrders();
                ordersData = ordersRes.data || [];
                
                // Calculate items sold from delivered orders
                const deliveredOrders = ordersData.filter(o => o.status === 'delivered');
                itemsSold = deliveredOrders.reduce((total, order) => {
                    const orderItems = order.items || [];
                    const orderTotal = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                    return total + orderTotal;
                }, 0);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                showToast('Failed to load orders', 'error');
            }

            // Calculate stats
            const active = listingsData.filter(
                item => item.status === 'active' || item.status === 'published'
            ).length;
            const total = listingsData.length;
            const pendingOrders = ordersData.filter(o => o.status === 'pending').length;

            setStats({
                totalProducts: total,
                activeListings: active,
                totalOrders: pendingOrders,
                itemsSold: itemsSold,
                followers: sellerData.followers_count || 0,
                rating: sellerData.average_rating || 0,
                reviews: sellerData.total_reviews || 0
            });
        } catch (error) {
            console.error('Failed to load seller data:', error);
            showToast('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getVerificationType = () => {
        if (!seller) return null;
        if (seller.is_business_verified && seller.verification_status === 'approved') {
            return 'business';
        }
        if (seller.is_identity_verified && seller.verification_status === 'approved') {
            return 'individual';
        }
        return null;
    };

    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`text-sm ${i <= roundedRating ? 'text-amber-500' : 'text-neutral-200'}`}>★</span>
            );
        }
        return stars;
    };

    return {
        seller,
        listings,
        loading,
        stats,
        getVerificationType,
        renderStars,
        loadSellerData,
    };
};