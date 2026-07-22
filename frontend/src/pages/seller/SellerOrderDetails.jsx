// pages/seller/SellerOrderDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMyOrder, updateOrderStatus } from "../../api/orders";
import { Icons } from "../../components/Icons";

const ORDER_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    READY_FOR_PICKUP: 'ready_for_pickup',
    PICKED_UP: 'picked_up',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// ✅ Steps for tracking
const TRACKING_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: '📋' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: '📦' },
    { key: 'picked_up', label: 'Picked Up', icon: '🚚' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚛' },
    { key: 'delivered', label: 'Delivered', icon: '🏠' },
    { key: 'completed', label: 'Completed', icon: '✨' },
];

const getStepIndex = (status) => {
    const orderFlow = ['pending', 'accepted', 'ready_for_pickup', 'picked_up', 'out_for_delivery', 'delivered', 'completed'];
    return orderFlow.indexOf(status);
};

function SellerOrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const res = await getMyOrder(orderId);
            setOrder(res.data);
        } catch (err) {
            console.error('Failed to load order:', err);
            setError('Order not found');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return;
        setUpdating(true);
        try {
            await updateOrderStatus(order.id, { status });
            await loadOrder();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to update order");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { label: "Pending", color: "text-amber-500", dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
            accepted: { label: "Accepted", color: "text-blue-500", dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
            ready_for_pickup: { label: "Ready for Pickup", color: "text-purple-500", dot: "bg-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
            picked_up: { label: "Picked Up", color: "text-indigo-500", dot: "bg-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200" },
            out_for_delivery: { label: "Out for Delivery", color: "text-blue-500", dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
            delivered: { label: "Delivered", color: "text-green-500", dot: "bg-green-500", bg: "bg-green-50", border: "border-green-200" },
            completed: { label: "Completed", color: "text-emerald-500", dot: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
            rejected: { label: "Rejected", color: "text-red-500", dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200" },
            cancelled: { label: "Cancelled", color: "text-neutral-400", dot: "bg-neutral-300", bg: "bg-neutral-50", border: "border-neutral-200" }
        };
        return configs[status] || configs.pending;
    };

    const getSellerActions = (status) => {
        const actions = {
            pending: ['accept', 'reject'],
            accepted: ['ready_for_pickup', 'cancel'],
            ready_for_pickup: [],
            picked_up: [],
            out_for_delivery: [],
            delivered: [],
            completed: [],
            rejected: [],
            cancelled: [],
        };
        return actions[status] || [];
    };

    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '?';
        return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';
    };

    const getImageUrl = (item) => {
        return item?.listing?.images?.[0]?.image_url || null;
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Order Details...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">{error || 'Order not found'}</p>
                    <Link 
                        to="/seller/orders" 
                        className="inline-block border border-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const actions = getSellerActions(order.status);
    const currentStepIndex = getStepIndex(order.status);
    const isRejectedOrCancelled = order.status === 'rejected' || order.status === 'cancelled';

    return (
        <div className="bg-neutral-50 min-h-screen py-10 md:py-14">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/seller/orders')}
                        className="flex items-center gap-2 text-xs text-neutral-400 hover:text-black transition-colors"
                    >
                        ← Back to Orders
                    </button>
                </div>

                {/* Order Card */}
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-light tracking-tight text-black">
                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-medium rounded-full ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                    {statusConfig.label}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">
                                Total: NPR {Number(order.total_amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {order.items?.length || 0} item(s)
                            </p>
                        </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
                                    {getInitials(order.buyer?.first_name, order.buyer?.last_name)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-800">
                                        {order.buyer?.first_name} {order.buyer?.last_name}
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        {order.buyer?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                                <span>📞 {order.receiver_phone}</span>
                                <span>📍 {order.delivery_address}</span>
                                <span>💳 {order.payment_method?.toUpperCase() || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    {!isRejectedOrCancelled && (
                        <div className="px-6 py-5 border-b border-neutral-100">
                            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-4">
                                Order Progress
                            </p>
                            <div className="flex items-center">
                                {TRACKING_STEPS.map((step, idx) => {
                                    const isCompleted = currentStepIndex >= idx;
                                    const isCurrent = currentStepIndex === idx;
                                    const isFuture = currentStepIndex < idx;
                                    
                                    return (
                                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                                                    isCompleted ? 'bg-black text-white' :
                                                    isCurrent ? 'bg-black text-white ring-4 ring-black/10' :
                                                    'bg-neutral-200 text-neutral-400'
                                                }`}>
                                                    {isCompleted ? '✓' : step.icon}
                                                </div>
                                                <span className={`text-[8px] mt-1.5 whitespace-nowrap ${
                                                    isCompleted ? 'text-black font-medium' :
                                                    isCurrent ? 'text-black font-medium' :
                                                    'text-neutral-300'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {idx < TRACKING_STEPS.length - 1 && (
                                                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                                                    currentStepIndex > idx ? 'bg-black' : 'bg-neutral-200'
                                                }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="px-6 py-5 border-b border-neutral-100">
                        <h3 className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-4">
                            Items
                        </h3>
                        <div className="space-y-4">
                            {order.items?.map((item) => {
                                const imageUrl = getImageUrl(item);
                                const title = item.listing?.title || 'Product';
                                const price = item.price_at_purchase || 0;
                                
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100 rounded">
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

                                        {/* Item Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-800">
                                                {title}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                                <span>Qty: {item.quantity}</span>
                                                <span>·</span>
                                                <span>NPR {Number(price).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-medium text-neutral-900">
                                                NPR {Number(price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-4 bg-neutral-50/50 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-neutral-500">
                            <span>Subtotal: <span className="text-neutral-700">NPR {Number(order.subtotal).toLocaleString()}</span></span>
                            <span className="mx-3">·</span>
                            <span>Delivery: <span className="text-neutral-700">NPR {Number(order.delivery_fee).toLocaleString()}</span></span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">
                                Total: NPR {Number(order.total_amount).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {actions.length > 0 && (
                        <div className="px-6 py-4 border-t border-neutral-100 bg-white flex flex-wrap gap-3">
                            {actions.includes('accept') && (
                                <button
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.ACCEPTED)}
                                    disabled={updating}
                                    className="px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                >
                                    Accept Order
                                </button>
                            )}
                            {actions.includes('reject') && (
                                <button
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.REJECTED)}
                                    disabled={updating}
                                    className="px-6 py-2.5 border border-red-300 text-red-500 text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    Reject Order
                                </button>
                            )}
                            {actions.includes('ready_for_pickup') && (
                                <button
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.READY_FOR_PICKUP)}
                                    disabled={updating}
                                    className="px-6 py-2.5 bg-purple-600 text-white text-[10px] uppercase tracking-[0.2em] hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    Mark Ready for Pickup
                                </button>
                            )}
                            {actions.includes('cancel') && (
                                <button
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.CANCELLED)}
                                    disabled={updating}
                                    className="px-6 py-2.5 border border-red-300 text-red-500 text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    )}

                    {/* Status Messages for Non-actionable Orders */}
                    {actions.length === 0 && order.status !== 'pending' && (
                        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
                            <p className="text-center text-xs text-neutral-400">
                                {order.status === 'ready_for_pickup' && '⏳ Awaiting delivery partner pickup'}
                                {order.status === 'picked_up' && '🚚 Package picked up by delivery partner'}
                                {order.status === 'out_for_delivery' && '🚛 Package is out for delivery'}
                                {order.status === 'delivered' && '✅ Package delivered to customer'}
                                {order.status === 'completed' && '✨ Order completed successfully'}
                                {order.status === 'rejected' && '❌ Order was rejected'}
                                {order.status === 'cancelled' && '✕ Order was cancelled'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SellerOrderDetails;