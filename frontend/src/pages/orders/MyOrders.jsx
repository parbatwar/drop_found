// pages/orders/MyOrders.jsx - Fixed version
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { getMyOrderGroups, updateOrderStatus } from "../../api/orders";
import { createReview } from "../../api/reviews";
import { Icons } from "../../components/Icons";
import StatusBadge from "../../components/common/StatusBadge";
import { 
    ORDER_STATUS, 
    ORDER_STATUS_LABELS,
    getStepIndex,
    getTrackingSteps 
} from "../../constants/orderStatus"; 

function MyOrders() {
    const navigate = useNavigate();
    const [orderGroups, setOrderGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        loadOrderGroups();
    }, []);

    const loadOrderGroups = async () => {
        try {
            const res = await getMyOrderGroups();
            setOrderGroups(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (orderGroupId) => {
        navigate(`/orders/invoice/${orderGroupId}`);
    };

    const handleCancelOrder = async (orderId, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            await updateOrderStatus(orderId, { status: ORDER_STATUS.CANCELLED });
            await loadOrderGroups();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to cancel order');
        }
    };

    const handleReviewClick = (order, e) => {
        e.stopPropagation();
        console.log('🔍 Order for review:', {
            id: order.id,
            status: order.status,
            items: order.items,
            firstItem: order.items?.[0],
            listing_id: order.items?.[0]?.listing_id,
            seller: order.seller?.shop_name
        });
        setSelectedOrder(order);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (reviewData.rating === 0) {
            alert("Please select a rating");
            return;
        }
        try {
            const orderId = selectedOrder.id;
            const firstItem = selectedOrder.items?.[0];
            const listingId = firstItem?.listing_id || firstItem?.listing?.id;
            
            console.log('🔍 Submitting review:', { 
                orderId, 
                listingId, 
                rating: reviewData.rating,
                comment: reviewData.comment,
                fullOrder: selectedOrder 
            });
            
            if (!listingId) {
                alert("Unable to find product for review. Please contact support.");
                return;
            }
            
            await createReview(orderId, listingId, {
                rating: reviewData.rating,
                comment: reviewData.comment,
            });
            
            setShowReviewModal(false);
            setSelectedOrder(null);
            setHoveredRating(0);
            setReviewData({ rating: 0, comment: "" });
            loadOrderGroups();
        } catch (err) {
            console.error('Review submission error:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.detail || "Failed to submit review";
            alert(errorMsg);
        }
    };

    // Only one canCancel and canReview function
    const canCancel = (status) => status === ORDER_STATUS.PENDING || status === ORDER_STATUS.ACCEPTED;
    const canReview = (status) => status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.COMPLETED;

    const getImageUrl = (order) => {
        return order.items?.[0]?.listing?.images?.[0]?.image_url || null;
    };

    const getTitle = (order) => {
        return order.items?.[0]?.listing?.title || 'Product';
    };

    const getItemCount = (order) => order.items?.length || 0;
    const getTotalItems = (group) => group.orders?.reduce((total, order) => total + getItemCount(order), 0) || 0;
    const getSellerCount = (group) => group.orders?.length || 0;

    // Get all individual orders with their group info
    const getAllOrders = () => {
        const allOrders = [];
        orderGroups.forEach(group => {
            group.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    groupId: group.id,
                    groupTotal: group.total_amount,
                    groupCreated: group.created_at,
                });
            });
        });
        return allOrders;
    };

    // Filter orders based on selected filter
    const getFilteredOrders = () => {
        const allOrders = getAllOrders();
        if (selectedFilter === 'all') return allOrders;
        return allOrders.filter(order => order.status === selectedFilter);
    };

    // Get count for each filter
    const getFilterCount = (filterKey) => {
        if (filterKey === 'all') return getAllOrders().length;
        return getAllOrders().filter(order => order.status === filterKey).length;
    };

    const filteredOrders = getFilteredOrders();
    const currentFilterLabel = FILTER_OPTIONS.find(f => f.key === selectedFilter)?.label || 'All Orders';

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
                                {getAllOrders().length} orders
                            </p>
                        </div>
                        
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-4 py-2 text-xs border border-neutral-200 rounded hover:border-neutral-400 transition-colors"
                            >
                                <span className="text-neutral-500">Filter:</span>
                                <span className="font-medium text-neutral-800">{currentFilterLabel}</span>
                                <svg className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {showFilterDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setShowFilterDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded shadow-lg z-20 py-1">
                                        {FILTER_OPTIONS.map((option) => {
                                            const count = getFilterCount(option.key);
                                            return (
                                                <button
                                                    key={option.key}
                                                    onClick={() => {
                                                        setSelectedFilter(option.key);
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                                                        selectedFilter === option.key ? 'bg-neutral-50 text-black' : 'text-neutral-600'
                                                    }`}
                                                >
                                                    <span>{option.label}</span>
                                                    <span className="text-neutral-400 text-[10px]">({count})</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="text-5xl font-light text-neutral-200 mb-4">📭</div>
                        <p className="text-sm text-neutral-400">No {selectedFilter !== 'all' ? STATUS_LABELS[selectedFilter]?.toLowerCase() || '' : ''} orders</p>
                        {selectedFilter !== 'all' && (
                            <button 
                                onClick={() => setSelectedFilter('all')}
                                className="inline-block mt-4 text-xs tracking-[0.2em] uppercase border-b border-neutral-300 pb-1 hover:border-black transition-colors"
                            >
                                View All Orders
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            const itemCount = getItemCount(order);
                            const imageUrl = getImageUrl(order);
                            const title = getTitle(order);
                            const sellerName = order.seller?.shop_name || 'Unknown Shop';

                            return (
                                <div 
                                    key={order.id} 
                                    className="border-b border-neutral-100 pb-6 last:border-0 cursor-pointer group hover:bg-neutral-50/30 -mx-2 px-2 rounded-sm transition-colors"
                                    onClick={() => handleOrderClick(order.groupId)}
                                >
                                    {/* Order Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-neutral-400 tracking-wide">
                                                    Order #{order.groupId.slice(0, 8).toUpperCase()}
                                                </p>
                                                <span className="text-[9px] text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View invoice →
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-neutral-300">
                                                {new Date(order.groupCreated).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-light">
                                                NPR {Number(order.total_amount).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-neutral-400">
                                                {sellerName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Item */}
                                    <div className="flex items-center gap-4 py-2 hover:bg-neutral-50/50 -mx-2 px-2 rounded-sm transition-colors">
                                        {/* Thumbnail */}
                                        <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[6px] uppercase tracking-wider">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-neutral-800 truncate">
                                                    {title}
                                                </span>
                                                {itemCount > 1 && (
                                                    <span className="text-xs text-neutral-400 flex-shrink-0">
                                                        +{itemCount - 1}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs mt-0.5">
                                                <span className="text-neutral-500">
                                                    {sellerName}
                                                </span>
                                                <span className="text-neutral-300">·</span>
                                                <span className="text-neutral-400">
                                                    Qty: {order.items?.[0]?.quantity || 1}
                                                </span>
                                                {order.payment_method && (
                                                    <>
                                                        <span className="text-neutral-300">·</span>
                                                        <span className="text-[10px] text-neutral-400 uppercase">
                                                            {order.payment_method}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                                <span className={`text-[10px] ${statusConfig.color}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>

                                            {canCancel(order.status) && (
                                                <button
                                                    onClick={(e) => handleCancelOrder(order.id, e)}
                                                    className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                            {canReview(order.status) && !order.review && (
                                                <button
                                                    onClick={(e) => handleReviewClick(order, e)}
                                                    className="text-[10px] text-neutral-400 hover:text-black transition-colors uppercase tracking-wider"
                                                >
                                                    Review
                                                </button>
                                            )}

                                            {order.review && (
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-xs ${
                                                                star <= order.review.rating
                                                                    ? "text-amber-400"
                                                                    : "text-neutral-200"
                                                            }`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-sm w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-light tracking-tight">Write a Review</h3>
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setSelectedOrder(null);
                                    setHoveredRating(0);
                                    setReviewData({ rating: 0, comment: "" });
                                }}
                                className="text-neutral-400 hover:text-black transition-colors"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-sm font-medium text-neutral-800">
                                {selectedOrder?.items?.[0]?.listing?.title || 'Product'}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {selectedOrder?.seller?.shop_name || 'Shop'}
                            </p>
                        </div>
                        
                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setReviewData({...reviewData, rating: star})}
                                    className="focus:outline-none"
                                >
                                    <Icons.Star 
                                        className={`w-7 h-7 ${
                                            star <= (hoveredRating || reviewData.rating) 
                                                ? 'text-amber-400 fill-amber-400' 
                                                : 'text-neutral-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="w-full border-b border-neutral-200 px-0 py-2 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors resize-none bg-transparent"
                            rows={3}
                            placeholder="Share your experience..."
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                        />
                        
                        <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-100">
                            <button 
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setSelectedOrder(null);
                                    setHoveredRating(0);
                                    setReviewData({ rating: 0, comment: "" });
                                }} 
                                className="flex-1 border border-neutral-200 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmitReview} 
                                className="flex-1 bg-black text-white py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                disabled={reviewData.rating === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrders;