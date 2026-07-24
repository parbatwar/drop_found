// pages/seller/SellerOrders.jsx - Refactored Version
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../../api/orders";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../hooks/useToast";
import { 
    ORDER_STATUS, 
    ORDER_STATUS_LABELS,
    getFilterLabel,
} from "../../constants/orderStatus";
import {
    getOrderImageUrl,
    getOrderTitle,
    getOrderItemCount,
    getOrderSellerName,
    formatOrderId,
} from "../../utils/orderUtils";
import { getInitials } from "../../utils/stringUtils";

function SellerOrders() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [actionToPerform, setActionToPerform] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await getSellerOrders();
            setOrders(res.data || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (orderId) => {
        navigate(`/seller/orders/${orderId}`);
    };

    const handleStatusUpdate = async (id, status, e) => {
        e?.stopPropagation();
        setOrderToUpdate(id);
        setActionToPerform(status);
        setShowConfirm(true);
    };

    const confirmStatusUpdate = async () => {
        if (!orderToUpdate || !actionToPerform) return;
        
        setUpdating(true);
        try {
            await updateOrderStatus(orderToUpdate, { status: actionToPerform });
            await loadOrders();
            showToast(`Order ${ORDER_STATUS_LABELS[actionToPerform]?.toLowerCase() || 'updated'} successfully`, 'success');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.detail || 'Failed to update order', 'error');
        } finally {
            setUpdating(false);
            setShowConfirm(false);
            setOrderToUpdate(null);
            setActionToPerform(null);
        }
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


    const getActionButton = (action, orderId) => {
        const configs = {
            accept: {
                label: 'Accept',
                className: 'bg-black text-white hover:bg-neutral-800',
            },
            reject: {
                label: 'Reject',
                className: 'border border-red-300 text-red-500 hover:bg-red-50',
            },
            ready_for_pickup: {
                label: 'Ready',
                className: 'bg-purple-600 text-white hover:bg-purple-700',
            },
            cancel: {
                label: 'Cancel',
                className: 'border border-red-300 text-red-500 hover:bg-red-50',
            },
        };

        const config = configs[action];
        if (!config) return null;

        return (
            <button
                onClick={(e) => handleStatusUpdate(orderId, action, e)}
                disabled={updating}
                className={`px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors disabled:opacity-50 ${config.className}`}
            >
                {config.label}
            </button>
        );
    };

    if (loading) {
        return <LoadingSpinner message="Loading Orders..." />;
    }

    const pendingCount = orders.filter(o => o.status === ORDER_STATUS.PENDING).length;

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
                            {pendingCount} Pending
                        </span>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="No orders found"
                        subtitle="Your orders will appear here once customers make purchases."
                    />
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
                                    const imageUrl = getOrderImageUrl(order);
                                    const title = getOrderTitle(order);
                                    const itemCount = getOrderItemCount(order);
                                    const sellerName = getOrderSellerName(order);
                                    const actions = getSellerActions(order.status);
                                    
                                    return (
                                        <tr
                                            key={order.id}
                                            onClick={() => handleOrderClick(order.id)}
                                            className="hover:bg-neutral-50 transition-colors cursor-pointer"
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
                                                <StatusBadge status={order.status} size="sm" />
                                            </td>

                                            {/* Actions */}
                                            <td className="py-5">
                                                <div className="flex justify-end gap-2 flex-wrap">
                                                    {actions.map((action) => (
                                                        <div key={action}>
                                                            {getActionButton(action, order.id)}
                                                        </div>
                                                    ))}
                                                    {actions.length === 0 && (
                                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                            No actions
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
                message={`Are you sure you want to ${actionToPerform ? ORDER_STATUS_LABELS[actionToPerform]?.toLowerCase() : 'update'} this order?`}
                confirmLabel={`Yes, ${actionToPerform ? ORDER_STATUS_LABELS[actionToPerform] : 'Update'}`}
                confirmVariant="primary"
                loading={updating}
            />
        </div>
    );
}

export default SellerOrders;