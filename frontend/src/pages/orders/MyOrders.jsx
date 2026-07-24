// pages/orders/MyOrders.jsx - Final Refactored Version
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useReviewModal } from '../../hooks/useReviewModal';
import OrderCard from '../../components/orders/OrderCard';
import OrderFilters from '../../components/orders/OrderFilters';
import ReviewModal from '../../components/orders/ReviewModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { useState } from 'react';

function MyOrders() {
    const navigate = useNavigate();
    const {
        loading,
        selectedFilter,
        setSelectedFilter,
        loadOrders,
        getFilteredOrders,
        getFilterCount,
        cancelOrder,
        cancelling,
    } = useOrders();

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const {
        isOpen: reviewOpen,
        selectedOrder,
        reviewData,
        hoveredRating,
        submitting,
        setReviewData,
        setHoveredRating,
        openReview,
        closeReview,
        submitReview,
    } = useReviewModal(loadOrders);

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = getFilteredOrders();

    const handleCancelClick = (orderId) => {
        setOrderToCancel(orderId);
        setShowCancelConfirm(true);
    };

    const handleCancelConfirm = async () => {
        if (!orderToCancel) return;
        const success = await cancelOrder(orderToCancel);
        if (success) {
            setShowCancelConfirm(false);
            setOrderToCancel(null);
        }
    };

    const handleOrderClick = (groupId) => {
        navigate(`/orders/invoice/${groupId}`);
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Orders...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-10 md:py-14">
            <div className="max-w-3xl mx-auto px-4 sm:px-8">
                
                {/* Header with Filter */}
                <div className="mb-8 pb-4 border-b border-neutral-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-black">
                                Orders
                            </h1>
                            <p className="text-xs text-neutral-400 mt-1 tracking-wide">
                                {getFilterCount('all')} orders
                            </p>
                        </div>
                        
                        <OrderFilters
                            selectedFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                            getFilterCount={getFilterCount}
                        />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <EmptyState
                        icon="📭"
                        title={`No ${selectedFilter !== 'all' ? ORDER_STATUS_LABELS[selectedFilter]?.toLowerCase() || '' : ''} orders`}
                        subtitle={selectedFilter !== 'all' ? "Try viewing all orders" : "You haven't placed any orders yet"}
                        actionLabel={selectedFilter !== 'all' ? "View All Orders" : undefined}
                        onAction={selectedFilter !== 'all' ? () => setSelectedFilter('all') : undefined}
                    />
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={handleCancelClick}
                                onReview={openReview}
                                showReview={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={reviewOpen}
                onClose={closeReview}
                order={selectedOrder}
                reviewData={reviewData}
                hoveredRating={hoveredRating}
                setReviewData={setReviewData}
                setHoveredRating={setHoveredRating}
                onSubmit={submitReview}
                submitting={submitting}
            />

            {/* Confirm Dialog  */}
            <ConfirmDialog
                isOpen={showCancelConfirm}
                onClose={() => {
                    setShowCancelConfirm(false);
                    setOrderToCancel(null);
                }}
                onConfirm={handleCancelConfirm}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmLabel="Yes, Cancel Order"
                confirmVariant="danger"
                loading={cancelling}
            />
        </div>
    );
}

export default MyOrders;