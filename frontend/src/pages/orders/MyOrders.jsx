// pages/MyOrders.jsx
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { getMyOrders } from "../../api/orders";
import { createReview } from "../../api/reviews";

// SVG Icons
const Icons = {
    Package: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    Star: ({ className = "w-5 h-5", filled = false }) => (
        <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
    Check: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    Clock: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    X: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await getMyOrders();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (reviewData.rating === 0) {
            alert("Please select a rating");
            return;
        }
        try {
            await createReview(selectedOrder.id, {
                rating: reviewData.rating,
                comment: reviewData.comment,
            });
            setShowReviewModal(false);
            setSelectedOrder(null);
            setHoveredRating(0);
            setReviewData({ rating: 0, comment: "" });
            loadOrders();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to submit review");
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: "Pending",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
                icon: Icons.Clock
            },
            accepted: {
                label: "Accepted",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                icon: null
            },
            shipped: {
                label: "Shipped",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200",
                icon: Icons.Package
            },
            delivered: {
                label: "Delivered",
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200",
                icon: Icons.Check
            },
            rejected: {
                label: "Rejected",
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-200",
                icon: Icons.X
            },
            cancelled: {
                label: "Cancelled",
                color: "text-neutral-400",
                bg: "bg-neutral-50",
                border: "border-neutral-200",
                icon: Icons.X
            }
        };
        return configs[status] || configs.pending;
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
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Account
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        My Orders
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        View and track all your purchases.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            {orders.length} Orders
                        </span>
                        {orders.filter(o => o.status === 'pending').length > 0 && (
                            <>
                                <span className="w-px h-3 bg-neutral-300"></span>
                                <span className="text-[10px] text-amber-600 uppercase tracking-wider">
                                    {orders.filter(o => o.status === 'pending').length} Pending
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="border border-neutral-200 bg-neutral-50 p-16 text-center">
                        <div className="text-4xl font-light text-neutral-300 mb-3">🛍️</div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">
                            No orders yet
                        </p>
                        <p className="text-[10px] text-neutral-300 mt-1">
                            Start shopping to see your orders here.
                        </p>
                        <Link 
                            to="/" 
                            className="inline-block mt-4 border border-black px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            
                            return (
                                <div 
                                    key={order.id} 
                                    className="group border border-neutral-100 hover:border-neutral-300 transition-colors duration-200 p-4 md:p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100">
                                            {order.listing?.images?.[0]?.image_url ? (
                                                <img 
                                                    src={order.listing.images[0].image_url} 
                                                    alt={order.listing?.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px] uppercase tracking-wider">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Info */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-sm font-light text-neutral-800 truncate">
                                                {order.listing?.title || "Product"}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <p className="text-sm font-medium text-neutral-900">
                                                    NPR {Number(order.total_amount).toLocaleString()}
                                                </p>
                                                <span className="w-px h-3 bg-neutral-200"></span>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                                    {order.payment_method}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-full ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                                                    {StatusIcon && <StatusIcon className="w-3 h-3" />}
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Review Section */}
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {order.status === "delivered" && !order.review && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowReviewModal(true);
                                                    }}
                                                    className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black border-b border-transparent hover:border-black transition-colors duration-200 pb-0.5"
                                                >
                                                    Write Review
                                                </button>
                                            )}

                                            {order.review && (
                                                <div className="flex items-center gap-1">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                className={`text-sm ${
                                                                    star <= order.review.rating
                                                                        ? "text-amber-500"
                                                                        : "text-neutral-200"
                                                                }`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-green-600 ml-1">✓ Reviewed</span>
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
                    <div className="bg-white p-8 max-w-md w-full border border-neutral-100">
                        <h3 className="text-lg font-light tracking-tight text-black mb-2">
                            Write a Review
                        </h3>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-6">
                            {selectedOrder?.listing?.title}
                        </p>
                        
                        {/* Rating Stars */}
                        <div className="mb-6">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-3">
                                Rating <span className="text-neutral-300">*</span>
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setReviewData({...reviewData, rating: star})}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Icons.Star 
                                            className={`w-7 h-7 ${
                                                star <= (hoveredRating || reviewData.rating) 
                                                    ? 'text-amber-500 fill-amber-500' 
                                                    : 'text-neutral-200'
                                            }`}
                                            filled={star <= (hoveredRating || reviewData.rating)}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Comment
                            </label>
                            <textarea
                                className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 resize-none bg-transparent"
                                rows={3}
                                placeholder="Share your experience with this product..."
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                            />
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-neutral-100">
                            <button 
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setSelectedOrder(null);
                                    setHoveredRating(0);
                                    setReviewData({ rating: 0, comment: "" });
                                }} 
                                className="flex-1 border border-neutral-200 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmitReview} 
                                className="flex-1 bg-black text-white py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                disabled={reviewData.rating === 0}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrders;``