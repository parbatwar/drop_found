// hooks/useListing.js
import { useState, useEffect, useCallback } from 'react';
import { getListing } from '../api/listings';
import { addToCart } from '../api/cart';
import { addToWishlist, removeFromWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';

export const useListing = (listingId) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    // Fetch listing data
    const fetchListing = useCallback(async () => {
        if (!listingId) return;
        setLoading(true);
        setError('');
        try {
            const res = await getListing(listingId);
            setListing(res.data);
            setIsWishlisted(res.data.is_wishlisted || false);
            setActiveImageIndex(0);
        } catch (err) {
            console.error(err);
            setError('Listing not found');
            showToast('Failed to load product', 'error');
        } finally {
            setLoading(false);
        }
    }, [listingId, showToast]);

    useEffect(() => {
        fetchListing();
    }, [fetchListing]);

    // Add to cart
    const handleAddToCart = useCallback(async (quantity = 1) => {
        if (!user) {
            navigate('/login');
            return false;
        }
        if (!listing) return false;
        
        setAddingToCart(true);
        try {
            await addToCart({ listing_id: listing.id, quantity });
            showToast('Added to cart!', 'success');
            return true;
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.detail || 'Failed to add to cart', 'error');
            return false;
        } finally {
            setAddingToCart(false);
        }
    }, [user, navigate, listing, showToast]);

    // Buy now
    const handleBuyNow = useCallback((quantity = 1) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!listing) return;
        navigate('/checkout', { state: { listing, quantity, quickBuy: true } });
    }, [user, navigate, listing]);

    // Toggle wishlist
    const toggleWishlist = useCallback(async () => {
        if (!user) {
            navigate('/login');
            return false;
        }
        if (!listing) return false;

        try {
            if (isWishlisted) {
                await removeFromWishlist(listing.id);
                setIsWishlisted(false);
                showToast('Removed from wishlist', 'success');
                return false;
            } else {
                await addToWishlist(listing.id);
                setIsWishlisted(true);
                showToast('Added to wishlist', 'success');
                return true;
            }
        } catch (err) {
            console.error(err);
            showToast('Something went wrong', 'error');
            return false;
        }
    }, [user, navigate, listing, isWishlisted, showToast]);

    // Image navigation
    const nextImage = useCallback(() => {
        if (!listing?.images?.length) return;
        setActiveImageIndex((prev) => (prev + 1) % listing.images.length);
    }, [listing]);

    const prevImage = useCallback(() => {
        if (!listing?.images?.length) return;
        setActiveImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }, [listing]);

    return {
        listing,
        loading,
        error,
        isWishlisted,
        activeImageIndex,
        addingToCart,
        setActiveImageIndex,
        fetchListing,
        handleAddToCart,
        handleBuyNow,
        toggleWishlist,
        nextImage,
        prevImage,
    };
};