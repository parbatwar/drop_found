// pages/MyOrders.jsx
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { getMyOrders } from "../../api/orders";
import { createReview } from "../../api/reviews";
import { Icons } from "../../components/Icons";

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
            console.log('📦 Orders response:', JSON.stringify(res.data, null, 2));
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

    // ✅ Get the first item from order (for display)
    const getFirstItem = (order) => {
        if (!order.items || order.items.length === 0) return null;
        return order.items[0];
    };

    // ✅ Get listing from the first item
    const getListing = (order) => {
        const item = getFirstItem(order);
        return item?.listing || {};
    };

    // ✅ Get image URL
    const getImageUrl = (order) => {
        const listing = getListing(order);
        return listing.images?.[0]?.image_url || null;
    };

    // ✅ Get title
    const getTitle = (order) => {
        const listing = getListing(order);
        return listing.title || 'Product';
    };

    // ✅ Get price (use total_amount from order)
    const getPrice = (order) => {
        return order.total_amount || 0;
    };

    // ✅ Get quantity
    const getQuantity = (order) => {
        const item = getFirstItem(order);
        return item?.quantity || 1;
    };

    // ✅ Get item count
    const getItemCount = (order) => {
        return order.items?.length || 0;
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
                            
                            const imageUrl = getImageUrl(order);
                            const title = getTitle(order);
                            const price = getPrice(order);
                            const quantity = getQuantity(order);
                            const itemCount = getItemCount(order);
                            
                            return (
                                <div 
                                    key={order.id} 
                                    className="group border border-neutral-100 hover:border-neutral-300 transition-colors duration-200 p-4 md:p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={title} 
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
                                                {title}
                                                {itemCount > 1 && (
                                                    <span className="text-neutral-400 text-xs ml-1">
                                                        +{itemCount - 1} more
                                                    </span>
                                                )}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <p className="text-sm font-medium text-neutral-900">
                                                    NPR {Number(price).toLocaleString()}
                                                </p>
                                                <span className="w-px h-3 bg-neutral-200"></span>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                                    Qty: {quantity}
                                                    {itemCount > 1 && ` (${itemCount} items)`}
                                                </p>
                                                <span className="w-px h-3 bg-neutral-200"></span>
                                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                                    {order.payment_method || 'N/A'}
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
                            {getTitle(selectedOrder) || 'Product'}
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

export default MyOrders;