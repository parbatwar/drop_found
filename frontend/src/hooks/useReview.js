// hooks/useReviews.js
import { useState, useEffect, useCallback } from 'react';
import { getListingReviews, getSellerReviews } from '../api/reviews';

/**
 * Hook for fetching listing reviews with pagination
 * @param {string} listingId - The listing ID
 * @param {number} initialLimit - Initial items per page (default: 10)
 */
export const useListingReviews = (listingId, initialLimit = 10) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchReviews = useCallback(async (pageNum = 1) => {
        if (!listingId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getListingReviews(listingId, {
                page: pageNum,
                limit: initialLimit,
            });
            
            const data = response.data;
            setReviews(data.reviews || []);
            setAverageRating(data.average_rating || 0);
            setTotalReviews(data.total_reviews || 0);
            setTotalPages(data.total_pages || 1);
            setPage(data.page || 1);
            setHasMore(data.page < data.total_pages);
        } catch (err) {
            console.error('Failed to fetch listing reviews:', err);
            setError(err.response?.data?.detail || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [listingId, initialLimit]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            fetchReviews(nextPage);
        }
    }, [hasMore, loading, page, fetchReviews]);

    useEffect(() => {
        fetchReviews(1);
    }, [listingId]);

    return {
        reviews,
        averageRating,
        totalReviews,
        loading,
        error,
        page,
        totalPages,
        hasMore,
        loadMore,
        refetch: fetchReviews,
    };
};

/**
 * Hook for fetching seller reviews with pagination
 * @param {string} sellerId - The seller ID
 * @param {number} initialLimit - Initial items per page (default: 10)
 */
export const useSellerReviews = (sellerId, initialLimit = 10) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchReviews = useCallback(async (pageNum = 1) => {
        if (!sellerId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getSellerReviews(sellerId, {
                page: pageNum,
                limit: initialLimit,
            });
            
            const data = response.data;
            setReviews(data.reviews || []);
            setAverageRating(data.average_rating || 0);
            setTotalReviews(data.total_reviews || 0);
            setTotalPages(data.total_pages || 1);
            setPage(data.page || 1);
            setHasMore(data.page < data.total_pages);
        } catch (err) {
            console.error('Failed to fetch seller reviews:', err);
            setError(err.response?.data?.detail || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [sellerId, initialLimit]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            fetchReviews(nextPage);
        }
    }, [hasMore, loading, page, fetchReviews]);

    useEffect(() => {
        fetchReviews(1);
    }, [sellerId]);

    return {
        reviews,
        averageRating,
        totalReviews,
        loading,
        error,
        page,
        totalPages,
        hasMore,
        loadMore,
        refetch: fetchReviews,
    };
};