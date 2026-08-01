// pages/seller/SellerOrderDetails.jsx - COMPLETELY FIXED
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMyOrder, updateOrderStatus } from "../../api/orders";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { 
    ORDER_STATUS, 
    ORDER_STATUS_LABELS,
    getTrackingSteps,
    getStepIndex,
} from "../../constants/orderStatus";
import {
    getOrderImageUrl,
    getOrderTitle,
    getOrderItemCount,
    getOrderSellerName,
    formatOrderId,
    formatOrderDate,
} from "../../utils/orderUtils";
import { getInitials } from "../../utils/stringUtils";

function SellerOrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionToPerform, setActionToPerform] = useState(null);
    const [actionLabel, setActionLabel] = useState('');

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const res = await getMyOrder(orderId);
            setOrder(res.data);
        } catch (err) {
            console.error('Failed to load order:', err);
            setError('Order not found');
            showToast('Failed to load order', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status, label, e) => {
        if (e) e.preventDefault();
        setActionToPerform(status);
        setActionLabel(label);
        setShowConfirm(true);
    };

    const confirmStatusUpdate = async () => {
        if (!actionToPerform) return;
        
        setUpdating(true);
        try {
            // ✅ Use updateOrderStatus for all statuses including 'completed'
            await updateOrderStatus(order.id, { status: actionToPerform });
            
            await loadOrder();
            const statusLabel = ORDER_STATUS_LABELS[actionToPerform] || 'updated';
            showToast(`Order ${statusLabel.toLowerCase()} successfully`, 'success');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail;
            const message = typeof errorMsg === 'string' 
                ? errorMsg 
                : (errorMsg ? JSON.stringify(errorMsg) : "Failed to update order");
            showToast(message, 'error');
        } finally {
            setUpdating(false);
            setShowConfirm(false);
            setActionToPerform(null);
            setActionLabel('');
        }
    };

    const getSellerActions = (status) => {
        const actions = {
            [ORDER_STATUS.PENDING]: ['accept', 'reject'],
            [ORDER_STATUS.ACCEPTED]: ['ready_for_pickup', 'cancel'],
            [ORDER_STATUS.READY_FOR_PICKUP]: [],
            [ORDER_STATUS.PICKED_UP]: [],
            [ORDER_STATUS.OUT_FOR_DELIVERY]: [],
            [ORDER_STATUS.DELIVERED]: ['complete'],
            [ORDER_STATUS.COMPLETED]: [],
            [ORDER_STATUS.REJECTED]: [],
            [ORDER_STATUS.CANCELLED]: [],
        };
        return actions[status] || [];
    };

    const getActionButton = (action) => {
        const actionToStatus = {
            accept: ORDER_STATUS.ACCEPTED,
            reject: ORDER_STATUS.REJECTED,
            ready_for_pickup: ORDER_STATUS.READY_FOR_PICKUP,
            cancel: ORDER_STATUS.CANCELLED,
            complete: ORDER_STATUS.COMPLETED,
        };

        const configs = {
            accept: {
                label: 'Accept Order',
                className: 'bg-black text-white hover:bg-neutral-800',
            },
            reject: {
                label: 'Reject Order',
                className: 'border border-red-300 text-red-500 hover:bg-red-50',
            },
            ready_for_pickup: {
                label: 'Mark Ready for Pickup',
                className: 'bg-purple-600 text-white hover:bg-purple-700',
            },
            cancel: {
                label: 'Cancel Order',
                className: 'border border-red-300 text-red-500 hover:bg-red-50',
            },
            complete: {
                label: 'Complete Order',
                className: 'bg-emerald-600 text-white hover:bg-emerald-700',
            },
        };

        const config = configs[action];
        const status = actionToStatus[action];
        
        if (!config || !status) return null;

        return (
            <button
                onClick={() => handleStatusUpdate(status, config.label)}
                disabled={updating}
                className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-50 ${config.className}`}
            >
                {config.label}
            </button>
        );
    };

    const getStatusMessage = (status) => {
        const messages = {
            [ORDER_STATUS.READY_FOR_PICKUP]: 'Awaiting delivery partner pickup',
            [ORDER_STATUS.PICKED_UP]: 'Package picked up by delivery partner',
            [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Package is out for delivery',
            [ORDER_STATUS.DELIVERED]: 'Package delivered to customer',
            [ORDER_STATUS.COMPLETED]: 'Order completed successfully',
            [ORDER_STATUS.REJECTED]: 'Order was rejected',
            [ORDER_STATUS.CANCELLED]: 'Order was cancelled',
        };
        return messages[status] || null;
    };

    const getActionDisplayLabel = (status) => {
        const statusToLabel = {
            [ORDER_STATUS.ACCEPTED]: 'Accept',
            [ORDER_STATUS.REJECTED]: 'Reject',
            [ORDER_STATUS.READY_FOR_PICKUP]: 'Ready for Pickup',
            [ORDER_STATUS.CANCELLED]: 'Cancel',
            [ORDER_STATUS.COMPLETED]: 'Complete',
        };
        return statusToLabel[status] || 'Update';
    };

    if (loading) {
        return <LoadingSpinner message="Loading Order Details..." />;
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

    const actions = getSellerActions(order.status);
    const currentStepIndex = getStepIndex(order.status);
    const isRejectedOrCancelled = order.status === ORDER_STATUS.REJECTED || order.status === ORDER_STATUS.CANCELLED;
    const trackingSteps = getTrackingSteps();
    const statusMessage = getStatusMessage(order.status);

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
                                    Order #{formatOrderId(order.id)}
                                </h1>
                                <StatusBadge status={order.status} size="md" />
                            </div>
                            <p className="text-xs text-neutral-400 mt-1">
                                Placed on {formatOrderDate(order.created_at)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-neutral-900">
                                Total: NPR {Number(order.total_amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {getOrderItemCount(order)} item(s)
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
                                {trackingSteps.map((step, idx) => {
                                    const isCompleted = currentStepIndex >= idx;
                                    const isCurrent = currentStepIndex === idx;
                                    
                                    return (
                                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                                                    isCompleted ? 'bg-black text-white' :
                                                    isCurrent ? 'bg-black text-white ring-4 ring-black/10' :
                                                    'bg-neutral-200 text-neutral-400'
                                                }`}>
                                                    {isCompleted ? '✓' : step.icon || '○'}
                                                </div>
                                                <span className={`text-[8px] mt-1.5 whitespace-nowrap ${
                                                    isCompleted ? 'text-black font-medium' :
                                                    isCurrent ? 'text-black font-medium' :
                                                    'text-neutral-300'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {idx < trackingSteps.length - 1 && (
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
                                const imageUrl = getOrderImageUrl({ items: [item] });
                                const title = item.listing?.title || 'Product';
                                const price = item.price_at_purchase || 0;
                                
                                return (
                                    <div key={item.id} className="flex items-center gap-4">
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
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-800">{title}</p>
                                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                                <span>Qty: {item.quantity}</span>
                                                <span>·</span>
                                                <span>NPR {Number(price).toLocaleString()}</span>
                                            </div>
                                        </div>
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
                            {actions.map((action) => (
                                <div key={action}>
                                    {getActionButton(action)}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Status Messages */}
                    {actions.length === 0 && order.status !== ORDER_STATUS.PENDING && statusMessage && (
                        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
                            <p className="text-center text-xs text-neutral-400">
                                {statusMessage}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => {
                    setShowConfirm(false);
                    setActionToPerform(null);
                    setActionLabel('');
                }}
                onConfirm={confirmStatusUpdate}
                title="Update Order Status"
                message={`Are you sure you want to ${actionLabel?.toLowerCase() || getActionDisplayLabel(actionToPerform)?.toLowerCase() || 'update'} this order?`}
                confirmLabel={`Yes, ${actionLabel || getActionDisplayLabel(actionToPerform) || 'Update'}`}
                confirmVariant={actionToPerform === ORDER_STATUS.COMPLETED ? 'success' : 'primary'}
                loading={updating}
            />
        </div>
    );
}

export default SellerOrderDetails;