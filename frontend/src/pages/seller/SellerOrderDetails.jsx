// pages/seller/SellerOrderDetails.jsx - Using new components
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMyOrder, updateOrderStatus } from "../../api/orders";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrderItemsList from "../../components/orders/OrderItemsList";
import OrderSummary from "../../components/orders/OrderSummary";
import OrderStatusMessage from "../../components/orders/OrderStatusMessage";
import { useToast } from "../../hooks/useToast";
import { 
    ORDER_STATUS, 
    ORDER_STATUS_LABELS,
    getTrackingSteps,
    getStepIndex,
} from "../../constants/orderStatus";
import {
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

    const handleStatusUpdate = async (status) => {
        setActionToPerform(status);
        setShowConfirm(true);
    };

    const confirmStatusUpdate = async () => {
        if (!actionToPerform) return;
        
        setUpdating(true);
        try {
            await updateOrderStatus(order.id, { status: actionToPerform });
            await loadOrder();
            showToast(`Order ${ORDER_STATUS_LABELS[actionToPerform]?.toLowerCase() || 'updated'} successfully`, 'success');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.detail || "Failed to update order", 'error');
        } finally {
            setUpdating(false);
            setShowConfirm(false);
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

    const getActionButton = (action) => {
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
        };

        const config = configs[action];
        if (!config) return null;

        return (
            <button
                onClick={() => handleStatusUpdate(action)}
                disabled={updating}
                className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-50 ${config.className}`}
            >
                {config.label}
            </button>
        );
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

                    {/* Items List - Using OrderItemsList component */}
                    <div className="px-6 py-5 border-b border-neutral-100">
                        <h3 className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-4">
                            Items
                        </h3>
                        <OrderItemsList items={order.items} showPrices={true} showQuantities={true} />
                    </div>

                    {/* Order Summary - Using OrderSummary component */}
                    <div className="px-6 py-4 bg-neutral-50/50">
                        <OrderSummary 
                            subtotal={order.subtotal}
                            deliveryFee={order.delivery_fee}
                            total={order.total_amount}
                        />
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

                    {/* Status Messages - Using OrderStatusMessage component */}
                    {actions.length === 0 && order.status !== ORDER_STATUS.PENDING && (
                        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
                            <OrderStatusMessage status={order.status} />
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

export default SellerOrderDetails;