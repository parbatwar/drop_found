// pages/seller/SellerOrders.jsx
import { useEffect, useState } from "react";
import { getSellerOrders, updateOrderStatus } from "../../api/orders";
import { Icons } from "../../components/Icons";

// ✅ Order status constants
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

function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await getSellerOrders();
            console.log('📦 Seller orders response:', JSON.stringify(res.data, null, 2));
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateOrderStatus(id, { status });
            loadOrders();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to update order");
        }
    };

    // ✅ Updated status configs with new flow
    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: "Pending",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200"
            },
            accepted: {
                label: "Accepted",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200"
            },
            ready_for_pickup: {
                label: "Ready for Pickup",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200"
            },
            picked_up: {
                label: "Picked Up",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-200"
            },
            out_for_delivery: {
                label: "Out for Delivery",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200"
            },
            delivered: {
                label: "Delivered",
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200"
            },
            completed: {
                label: "Completed",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200"
            },
            rejected: {
                label: "Rejected",
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-200"
            },
            cancelled: {
                label: "Cancelled",
                color: "text-neutral-400",
                bg: "bg-neutral-50",
                border: "border-neutral-200"
            }
        };
        return configs[status] || configs.pending;
    };

    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '?';
        return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';
    };

    // Helper functions for order display
    const getFirstItem = (order) => {
        if (!order.items || order.items.length === 0) return null;
        return order.items[0];
    };

    const getListing = (order) => {
        const item = getFirstItem(order);
        return item?.listing || {};
    };

    const getImageUrl = (order) => {
        const listing = getListing(order);
        return listing.images?.[0]?.image_url || null;
    };

    const getTitle = (order) => {
        const listing = getListing(order);
        return listing.title || 'Product';
    };

    const getItemCount = (order) => {
        return order.items?.length || 0;
    };

    // ✅ Check what actions seller can take
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
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Orders
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        Seller Orders
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        Manage and track all your customer orders.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            {orders.length} Orders
                        </span>
                        <span className="w-px h-3 bg-neutral-300"></span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            {orders.filter(o => o.status === ORDER_STATUS.PENDING).length} Pending
                        </span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="border border-neutral-200 bg-neutral-50 p-16 text-center">
                        <div className="text-4xl font-light text-neutral-300 mb-3">📦</div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">
                            No orders found
                        </p>
                        <p className="text-[10px] text-neutral-300 mt-1">
                            Your orders will appear here once customers make purchases.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                                        Product
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                                        Buyer
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium hidden md:table-cell">
                                        Contact
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium hidden lg:table-cell">
                                        Address
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium hidden sm:table-cell">
                                        Payment
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                                        Total
                                    </th>
                                    <th className="py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                                        Status
                                    </th>
                                    <th className="py-4 text-right text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-neutral-100">
                                {orders.map((order) => {
                                    const statusConfig = getStatusConfig(order.status);
                                    const imageUrl = getImageUrl(order);
                                    const title = getTitle(order);
                                    const itemCount = getItemCount(order);
                                    const actions = getSellerActions(order.status);
                                    
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-neutral-50 transition-colors"
                                        >
                                            {/* Product */}
                                            <td className="py-5 pr-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-16 bg-neutral-100 overflow-hidden flex-shrink-0">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px] uppercase tracking-wider bg-neutral-100">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-neutral-800 line-clamp-2">
                                                            {title}
                                                            {itemCount > 1 && (
                                                                <span className="text-neutral-400 text-[9px] ml-1">
                                                                    +{itemCount - 1} more
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                                            {order.items?.length || 0} item(s)
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Buyer */}
                                            <td className="py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-[9px] font-medium text-neutral-500">
                                                        {getInitials(order.buyer?.first_name, order.buyer?.last_name)}
                                                    </div>
                                                    <span className="text-sm text-neutral-700">
                                                        {order.buyer?.first_name} {order.buyer?.last_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-5 text-sm text-neutral-600 hidden md:table-cell">
                                                {order.receiver_phone}
                                            </td>

                                            {/* Address */}
                                            <td className="py-5 text-sm text-neutral-600 hidden lg:table-cell max-w-[200px] truncate">
                                                {order.delivery_address}
                                            </td>

                                            {/* Payment */}
                                            <td className="py-5 hidden sm:table-cell">
                                                <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                                                    {order.payment_method}
                                                </span>
                                            </td>

                                            {/* Total */}
                                            <td className="py-5">
                                                <span className="text-sm font-medium text-neutral-900">
                                                    NPR {Number(order.total_amount).toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-medium rounded-full ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </td>

                                            {/* ✅ Actions - Updated with new flow */}
                                            <td className="py-5">
                                                <div className="flex justify-end gap-2 flex-wrap">
                                                    {/* ✅ PENDING: Accept or Reject */}
                                                    {actions.includes('accept') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.ACCEPTED)}
                                                            className="px-4 py-1.5 bg-black text-white text-[9px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                    {actions.includes('reject') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.REJECTED)}
                                                            className="px-4 py-1.5 border border-neutral-300 text-[9px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}

                                                    {/* ✅ ACCEPTED: Ready for Pickup or Cancel */}
                                                    {actions.includes('ready_for_pickup') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.READY_FOR_PICKUP)}
                                                            className="px-4 py-1.5 bg-purple-600 text-white text-[9px] uppercase tracking-[0.2em] hover:bg-purple-700 transition-colors"
                                                        >
                                                            Ready for Pickup
                                                        </button>
                                                    )}
                                                    {actions.includes('cancel') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.CANCELLED)}
                                                            className="px-4 py-1.5 border border-red-300 text-red-500 text-[9px] uppercase tracking-[0.2em] hover:bg-red-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {/* ✅ Status indicators for non-actionable statuses */}
                                                    {order.status === ORDER_STATUS.READY_FOR_PICKUP && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-purple-600 flex items-center gap-1">
                                                            <Icons.Package className="w-3 h-3" />
                                                            Waiting for pickup
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.PICKED_UP && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-1">
                                                            <Icons.Truck className="w-3 h-3" />
                                                            With delivery
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-blue-600 flex items-center gap-1">
                                                            <Icons.Truck className="w-3 h-3" />
                                                            Out for delivery
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.DELIVERED && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-green-600 flex items-center gap-1">
                                                            <Icons.Check className="w-3 h-3" />
                                                            Delivered
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.COMPLETED && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-1">
                                                            <Icons.Check className="w-3 h-3" />
                                                            Completed
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.REJECTED && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-red-600 flex items-center gap-1">
                                                            <Icons.X className="w-3 h-3" />
                                                            Rejected
                                                        </span>
                                                    )}

                                                    {order.status === ORDER_STATUS.CANCELLED && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-1">
                                                            <Icons.X className="w-3 h-3" />
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SellerOrders;