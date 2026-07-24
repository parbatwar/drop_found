// pages/admin/AdminOrders.jsx - Refactored Version
import { useState, useEffect } from 'react';
import { getAllOrders, adminUpdateOrderStatus, completeOrder } from '../../api/orders';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
    ORDER_STATUS, 
    ORDER_STATUS_LABELS,
    ORDER_FILTER_OPTIONS,
    getFilterLabel,
} from '../../constants/orderStatus';
import {
    getOrderImageUrl,
    getOrderTitle,
    getOrderItemCount,
    formatOrderId,
    formatOrderDate,
} from '../../utils/orderUtils';
import { getInitials } from '../../utils/stringUtils';

function AdminOrders() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [actionToPerform, setActionToPerform] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllOrders({ 
                status: filter || undefined, 
                limit: 100 
            });
            
            let ordersData = [];
            if (res.data) {
                ordersData = Array.isArray(res.data) ? res.data : res.data.data || [];
            }
            setOrders(ordersData);
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError(err.response?.data?.detail || 'Failed to load orders');
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setOrderToUpdate(orderId);
        setActionToPerform(newStatus);
        setShowConfirm(true);
    };

    const confirmStatusUpdate = async () => {
        if (!orderToUpdate || !actionToPerform) return;
        
        setUpdating(true);
        try {
            await adminUpdateOrderStatus(orderToUpdate, { status: actionToPerform });
            await loadOrders();
            showToast(`Order ${ORDER_STATUS_LABELS[actionToPerform]?.toLowerCase() || 'updated'} successfully`, 'success');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to update order', 'error');
        } finally {
            setUpdating(false);
            setShowConfirm(false);
            setOrderToUpdate(null);
            setActionToPerform(null);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        setOrderToUpdate(orderId);
        setActionToPerform('complete');
        setShowConfirm(true);
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

    const getActionButton = (action, orderId) => {
        const configs = {
            out_for_delivery: {
                label: 'Out for Delivery',
                className: 'bg-blue-600 text-white hover:bg-blue-700',
            },
            delivered: {
                label: 'Mark Delivered',
                className: 'bg-green-600 text-white hover:bg-green-700',
            },
            complete: {
                label: 'Complete',
                className: 'bg-emerald-600 text-white hover:bg-emerald-700',
            },
            picked_up: {
                label: 'Pick Up',
                className: 'bg-indigo-600 text-white hover:bg-indigo-700',
            },
        };

        const config = configs[action];
        if (!config) return null;

        const handleClick = action === 'complete' 
            ? () => handleCompleteOrder(orderId)
            : () => handleStatusUpdate(orderId, action);

        return (
            <button
                onClick={handleClick}
                disabled={updating}
                className={`px-3 py-1 text-[8px] uppercase tracking-wider transition-colors disabled:opacity-50 ${config.className}`}
            >
                {config.label}
            </button>
        );
    };

    const filteredOrders = searchTerm
        ? orders.filter(order => 
            order.id?.includes(searchTerm) || 
            order.buyer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.buyer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getOrderTitle(order).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : orders;

    if (loading) return <LoadingSpinner message="Loading Orders..." />;

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
                <EmptyState
                    icon="📦"
                    title="No orders found"
                    subtitle="Orders will appear here once customers make purchases."
                />
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
                                    const imageUrl = getOrderImageUrl(order);
                                    const title = getOrderTitle(order);
                                    const itemCount = getOrderItemCount(order);

                                    return (
                                        <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="text-xs font-mono text-neutral-600">
                                                    #{formatOrderId(order.id)}
                                                </p>
                                                <p className="text-[9px] text-neutral-400">
                                                    {formatOrderDate(order.created_at)}
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
                                                <StatusBadge status={status} size="sm" />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-end gap-1.5 flex-wrap">
                                                    {actions.map((action) => (
                                                        <div key={action}>
                                                            {getActionButton(action, order.id)}
                                                        </div>
                                                    ))}
                                                    {actions.length === 0 && (
                                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                            {status === ORDER_STATUS.COMPLETED ? 'Done' : 
                                                             status === ORDER_STATUS.REJECTED ? 'Rejected' :
                                                             status === ORDER_STATUS.CANCELLED ? 'Cancelled' :
                                                             'Waiting'}
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

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => {
                    setShowConfirm(false);
                    setOrderToUpdate(null);
                    setActionToPerform(null);
                }}
                onConfirm={confirmStatusUpdate}
                title="Update Order Status"
                message={`Are you sure you want to ${actionToPerform ? ORDER_STATUS_LABELS[actionToPerform]?.toLowerCase() || actionToPerform : 'update'} this order?`}
                confirmLabel={`Yes, ${actionToPerform ? ORDER_STATUS_LABELS[actionToPerform] || actionToPerform : 'Update'}`}
                confirmVariant="primary"
                loading={updating}
            />
        </div>
    );
}

export default AdminOrders;