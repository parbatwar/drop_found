// pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { getAllOrders, adminUpdateOrderStatus, completeOrder } from '../../api/orders';

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

const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Pending',
    [ORDER_STATUS.ACCEPTED]: 'Accepted',
    [ORDER_STATUS.REJECTED]: 'Rejected',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'Ready for Pickup',
    [ORDER_STATUS.PICKED_UP]: 'Picked Up',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.COMPLETED]: 'Completed',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'bg-amber-50 text-amber-600 border-amber-200',
    [ORDER_STATUS.ACCEPTED]: 'bg-blue-50 text-blue-600 border-blue-200',
    [ORDER_STATUS.REJECTED]: 'bg-red-50 text-red-600 border-red-200',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'bg-purple-50 text-purple-600 border-purple-200',
    [ORDER_STATUS.PICKED_UP]: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-blue-50 text-blue-600 border-blue-200',
    [ORDER_STATUS.DELIVERED]: 'bg-green-50 text-green-600 border-green-200',
    [ORDER_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    [ORDER_STATUS.CANCELLED]: 'bg-neutral-50 text-neutral-400 border-neutral-200',
};

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('📤 Fetching orders with filter:', filter);
            const res = await getAllOrders({ 
                status: filter || undefined, 
                limit: 100 
            });
            console.log('📦 Orders response:', res);
            console.log('📦 Orders data:', res.data);
            
            // Handle different response structures
            let ordersData = [];
            if (res.data) {
                ordersData = Array.isArray(res.data) ? res.data : res.data.data || [];
            }
            setOrders(ordersData);
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError(err.response?.data?.detail || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!confirm(`Update order status to "${ORDER_STATUS_LABELS[newStatus]}"?`)) return;
        try {
            await adminUpdateOrderStatus(orderId, { status: newStatus });
            await loadOrders();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to update order');
        }
    };

    const handleCompleteOrder = async (orderId) => {
        if (!confirm('Mark this order as completed?')) return;
        try {
            await completeOrder(orderId);
            await loadOrders();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to complete order');
        }
    };

    const getAdminActions = (status) => {
        const actions = {
            [ORDER_STATUS.READY_FOR_PICKUP]: ['picked_up'],
            [ORDER_STATUS.PICKED_UP]: ['out_for_delivery'],
            [ORDER_STATUS.OUT_FOR_DELIVERY]: ['delivered'],
            [ORDER_STATUS.DELIVERED]: ['complete'],
        };
        return actions[status] || [];
    };

    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '?';
        return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';
    };

    const getFirstItem = (order) => {
        if (!order.items || order.items.length === 0) return null;
        return order.items[0];
    };

    const getImageUrl = (order) => {
        const item = getFirstItem(order);
        return item?.listing?.images?.[0]?.image_url || null;
    };

    const getTitle = (order) => {
        const item = getFirstItem(order);
        return item?.listing?.title || 'Product';
    };

    const filteredOrders = searchTerm
        ? orders.filter(order => 
            order.id?.includes(searchTerm) || 
            order.buyer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getTitle(order).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : orders;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Orders...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-2 border-red-400 px-5 py-4 text-sm text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight text-black">
                                Order Management
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Manage all orders, delivery status, and completions.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-light text-neutral-300">
                        {orders.length}
                    </span>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                        Orders
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => setFilter('')}
                    className={`px-4 py-1.5 text-[10px] uppercase tracking-wider border transition-colors ${
                        !filter ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
                    }`}
                >
                    All
                </button>
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-wider border transition-colors ${
                            filter === value ? 'bg-black text-white border-black' : 'border-neutral-200 hover:border-black'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by order ID, buyer name, or product..."
                    className="w-full max-w-md border-b border-neutral-200 px-0 py-2.5 text-sm focus:border-black outline-none transition-colors bg-transparent"
                />
            </div>

            {/* Orders Table */}
            {orders.length === 0 ? (
                <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                    <p className="text-sm text-neutral-400 uppercase tracking-wider">
                        No orders found
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-neutral-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-neutral-50">
                                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Buyer
                                    </th>
                                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredOrders.map((order) => {
                                    const status = order.status;
                                    const actions = getAdminActions(status);
                                    const statusClass = ORDER_STATUS_COLORS[status] || 'bg-neutral-50 text-neutral-400 border-neutral-200';
                                    const imageUrl = getImageUrl(order);
                                    const title = getTitle(order);
                                    const itemCount = order.items?.length || 0;

                                    return (
                                        <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="text-xs font-mono text-neutral-600">
                                                    #{order.id?.slice(0, 8) || 'N/A'}
                                                </p>
                                                <p className="text-[9px] text-neutral-400">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-12 bg-neutral-100 overflow-hidden flex-shrink-0">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px]">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-neutral-800 truncate max-w-[120px]">
                                                            {title}
                                                        </p>
                                                        {itemCount > 1 && (
                                                            <p className="text-[9px] text-neutral-400">+{itemCount - 1} more</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[9px] font-medium text-neutral-500">
                                                        {getInitials(order.buyer?.first_name, order.buyer?.last_name)}
                                                    </div>
                                                    <span className="text-xs text-neutral-700">
                                                        {order.buyer?.first_name} {order.buyer?.last_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-neutral-900">
                                                    NPR {Number(order.total_amount || 0).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded border ${statusClass}`}>
                                                    {ORDER_STATUS_LABELS[status] || status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-1.5 flex-wrap">
                                                    {actions.includes('out_for_delivery') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.OUT_FOR_DELIVERY)}
                                                            className="px-3 py-1 bg-blue-600 text-white text-[8px] uppercase tracking-wider hover:bg-blue-700 transition-colors"
                                                        >
                                                            Out for Delivery
                                                        </button>
                                                    )}
                                                    {actions.includes('delivered') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.DELIVERED)}
                                                            className="px-3 py-1 bg-green-600 text-white text-[8px] uppercase tracking-wider hover:bg-green-700 transition-colors"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                    {actions.includes('complete') && (
                                                        <button
                                                            onClick={() => handleCompleteOrder(order.id)}
                                                            className="px-3 py-1 bg-emerald-600 text-white text-[8px] uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    {actions.includes('picked_up') && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, ORDER_STATUS.PICKED_UP)}
                                                            className="px-3 py-1 bg-indigo-600 text-white text-[8px] uppercase tracking-wider hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Pick Up
                                                        </button>
                                                    )}
                                                    {actions.length === 0 && (
                                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                            {status === ORDER_STATUS.COMPLETED ? '✅ Done' : 
                                                             status === ORDER_STATUS.REJECTED ? '❌ Rejected' :
                                                             status === ORDER_STATUS.CANCELLED ? '🚫 Cancelled' :
                                                             '⏳ Waiting'}
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
                </div>
            )}
        </div>
    );
}

export default AdminOrders;