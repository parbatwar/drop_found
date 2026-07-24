/**
 * @file useReviewModal.js
 * @description Custom React hook for managing review modal state, rating inputs, hover effects, 
 * and handling the submission of product reviews with validation and error handling.
 */

import { useState } from 'react';
import { createReview } from '../api/reviews';
import { useToast } from './useToast';

export const useReviewModal = (onSuccess) => {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const openReview = (order) => {
        setSelectedOrder(order);
        setIsOpen(true);
    };

    const closeReview = () => {
        setIsOpen(false);
        setSelectedOrder(null);
        setHoveredRating(0);
        setReviewData({ rating: 0, comment: "" });
    };

    const submitReview = async () => {
        if (reviewData.rating === 0) {
            showToast('Please select a rating', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const orderId = selectedOrder.id;
            const firstItem = selectedOrder?.items?.[0];
            const listingId = firstItem?.listing_id || firstItem?.listing?.id;

            if (!listingId) {
                showToast('Unable to find product for review. Please contact support.', 'error');
                return;
            }

            await createReview(orderId, listingId, {
                rating: reviewData.rating,
                comment: reviewData.comment,
            });

            showToast('Review submitted successfully!', 'success');
            closeReview();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Review submission error:', err);
            const errorMsg = err.response?.data?.detail || "Failed to submit review";
            showToast(errorMsg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        isOpen,
        selectedOrder,
        reviewData,
        hoveredRating,
        submitting,
        setReviewData,
        setHoveredRating,
        openReview,
        closeReview,
        submitReview,
    };
};