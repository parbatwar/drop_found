// pages/seller/SellerOrders.jsx
import { useEffect, useState } from "react";
import { getSellerOrders, updateOrderStatus } from "../../api/orders";

// SVG Icons
const Icons = {
    Package: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    User: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Phone: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Location: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    CreditCard: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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
            delivered: {
                label: "Delivered",
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200"
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
                            {orders.filter(o => o.status === 'pending').length} Pending
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
                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-neutral-50 transition-colors"
                                        >
                                            {/* Product */}
                                            <td className="py-5 pr-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-16 bg-neutral-100 overflow-hidden flex-shrink-0">
                                                        {order.listing?.images?.[0]?.image_url ? (
                                                            <img
                                                                src={order.listing.images[0].image_url}
                                                                alt={order.listing?.title}
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
                                                            {order.listing?.title || 'Product'}
                                                        </p>
                                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                                            {order.listing?.seller_type || 'Item'}
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
                                                    {order.status === 'pending' && <Icons.Clock className="w-3 h-3" />}
                                                    {order.status === 'delivered' && <Icons.Check className="w-3 h-3" />}
                                                    {statusConfig.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-5">
                                                <div className="flex justify-end gap-2 flex-wrap">
                                                    {order.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(order.id, "accepted")}
                                                                className="px-4 py-1.5 bg-black text-white text-[9px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(order.id, "rejected")}
                                                                className="px-4 py-1.5 border border-neutral-300 text-[9px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {order.status === "accepted" && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, "delivered")}
                                                            className="px-4 py-1.5 bg-black text-white text-[9px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}

                                                    {(order.status === "delivered" ||
                                                        order.status === "rejected" ||
                                                        order.status === "cancelled") && (
                                                        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-1">
                                                            <Icons.Check className="w-3 h-3 text-neutral-400" />
                                                            Completed
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