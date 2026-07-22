// pages/orders/Invoice.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderGroup } from "../../api/orders";
import { Icons } from "../../components/Icons";

function Invoice() {
    const { orderGroupId } = useParams();
    const navigate = useNavigate();
    const [orderGroup, setOrderGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadInvoice();
    }, [orderGroupId]);

    const loadInvoice = async () => {
        try {
            const res = await getOrderGroup(orderGroupId);
            setOrderGroup(res.data);
        } catch (err) {
            console.error('Failed to load invoice:', err);
            setError('Order not found');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { label: "Pending", color: "text-amber-500", dot: "bg-amber-500" },
            accepted: { label: "Accepted", color: "text-blue-500", dot: "bg-blue-500" },
            ready_for_pickup: { label: "Ready for Pickup", color: "text-purple-500", dot: "bg-purple-500" },
            picked_up: { label: "Picked Up", color: "text-indigo-500", dot: "bg-indigo-500" },
            out_for_delivery: { label: "Out for Delivery", color: "text-blue-500", dot: "bg-blue-500" },
            delivered: { label: "Delivered", color: "text-green-500", dot: "bg-green-500" },
            completed: { label: "Completed", color: "text-emerald-500", dot: "bg-emerald-500" },
            rejected: { label: "Rejected", color: "text-red-500", dot: "bg-red-500" },
            cancelled: { label: "Cancelled", color: "text-neutral-400", dot: "bg-neutral-300" }
        };
        return configs[status] || configs.pending;
    };

    // ✅ Check if order should be excluded from grand total
    const isExcludedFromTotal = (status) => {
        return status === 'rejected' || status === 'cancelled';
    };

    // ✅ Calculate grand total excluding cancelled/rejected orders
    const calculateGrandTotal = () => {
        if (!orderGroup?.orders) return 0;
        return orderGroup.orders
            .filter(order => !isExcludedFromTotal(order.status))
            .reduce((total, order) => total + Number(order.total_amount), 0);
    };

    // ✅ Count active orders (not cancelled or rejected)
    const getActiveOrderCount = () => {
        if (!orderGroup?.orders) return 0;
        return orderGroup.orders.filter(order => !isExcludedFromTotal(order.status)).length;
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Invoice...
                </div>
            </div>
        );
    }

    if (error || !orderGroup) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">{error || 'Order not found'}</p>
                    <Link 
                        to="/orders" 
                        className="inline-block border border-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const totalItems = orderGroup.orders?.reduce((total, order) => total + (order.items?.length || 0), 0) || 0;
    const allOrdersDelivered = orderGroup.orders?.every(order => order.status === 'delivered' || order.status === 'completed');
    const grandTotal = calculateGrandTotal();
    const activeOrderCount = getActiveOrderCount();
    const hasExcludedOrders = orderGroup.orders?.some(order => isExcludedFromTotal(order.status));

    return (
        <div className="bg-neutral-50 min-h-screen py-10 md:py-14">
            <div className="max-w-3xl mx-auto px-4 sm:px-8">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 text-xs text-neutral-400 hover:text-black transition-colors mb-6"
                >
                    ← Back to Orders
                </button>

                {/* Invoice Card */}
                <div className="bg-white border border-neutral-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-light tracking-tight text-black">
                                Invoice
                            </h1>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                Order #{orderGroup.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-400">
                                {new Date(orderGroup.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Order Status - Timeline */}
                    <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                        <div className="flex flex-wrap items-center gap-2">
                            {orderGroup.orders?.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                const isLast = index === orderGroup.orders.length - 1;
                                const isExcluded = isExcludedFromTotal(order.status);
                                return (
                                    <div key={order.id} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                                            <span className={`text-[10px] ${isExcluded ? 'text-neutral-400 line-through' : statusConfig.color}`}>
                                                {order.seller?.shop_name || 'Shop'}
                                            </span>
                                            <span className={`text-[10px] ${isExcluded ? 'text-neutral-400' : 'text-neutral-400'}`}>
                                                ({statusConfig.label})
                                            </span>
                                        </div>
                                        {!isLast && (
                                            <span className="text-neutral-300 text-xs">·</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Each Seller's Items */}
                    <div className="divide-y divide-neutral-100">
                        {orderGroup.orders?.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            const isExcluded = isExcludedFromTotal(order.status);
                            
                            return (
                                <div key={order.id} className={`p-6 ${isExcluded ? 'opacity-60' : ''}`}>
                                    {/* Seller Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                                                {order.seller?.shop_name || 'Unknown Shop'}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-full ${isExcluded ? 'bg-neutral-100 text-neutral-400 border-neutral-200' : 'bg-neutral-50 text-neutral-600 border border-neutral-200'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-3">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                {/* Thumbnail */}
                                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100">
                                                    {item.listing?.images?.[0]?.image_url ? (
                                                        <img 
                                                            src={item.listing.images[0].image_url} 
                                                            alt={item.listing?.title || 'Product'}
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
                                                    <p className={`text-sm ${isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                                                        {item.listing?.title || 'Product'}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>·</span>
                                                        <span>NPR {Number(item.price_at_purchase).toLocaleString()}</span>
                                                        {item.quantity > 1 && (
                                                            <>
                                                                <span>·</span>
                                                                <span>
                                                                    NPR {Number(item.price_at_purchase * item.quantity).toLocaleString()}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`text-sm font-medium ${isExcluded ? 'text-neutral-400 line-through' : ''}`}>
                                                        NPR {Number(item.price_at_purchase * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-4 pt-4 border-t border-neutral-100">
                                        <div className="flex items-center justify-end gap-6 text-sm">
                                            <div className="text-neutral-400">
                                                <span>Subtotal: </span>
                                                <span className={isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-600'}>
                                                    NPR {Number(order.subtotal).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-neutral-400">
                                                <span>Delivery: </span>
                                                <span className={isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-600'}>
                                                    NPR {Number(order.delivery_fee).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className={`font-medium ${isExcluded ? 'text-neutral-400' : 'text-neutral-800'}`}>
                                                <span>Total: </span>
                                                <span className={isExcluded ? 'line-through' : ''}>
                                                    NPR {Number(order.total_amount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Details */}
                                    <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                                        <span>📞 {order.receiver_phone}</span>
                                        <span>📍 {order.delivery_address}</span>
                                        <span>💳 {order.payment_method?.toUpperCase() || 'N/A'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer - Grand Total */}
                    <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-neutral-400">Grand Total</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-light">
                                NPR {Number(grandTotal).toLocaleString()}
                            </p>
                            {hasExcludedOrders && (
                                <p className="text-[9px] text-neutral-400">
                                    Excludes cancelled/rejected orders
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Invoice;