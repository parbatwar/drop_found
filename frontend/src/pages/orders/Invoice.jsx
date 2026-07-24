// pages/orders/Invoice.jsx - Refactored Version
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderGroup } from "../../api/orders";
import { Icons } from "../../components/Icons";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import OrderItemsList from "../../components/orders/OrderItemsList";
import { 
    formatOrderId, 
    formatOrderDate,
    getOrderSellerName,
} from "../../utils/orderUtils";
import { ORDER_STATUS } from "../../constants/orderStatus";

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

    const isExcludedFromTotal = (status) => {
        return status === ORDER_STATUS.REJECTED || status === ORDER_STATUS.CANCELLED;
    };

    const calculateGrandTotal = () => {
        if (!orderGroup?.orders) return 0;
        return orderGroup.orders
            .filter(order => !isExcludedFromTotal(order.status))
            .reduce((total, order) => total + Number(order.total_amount), 0);
    };

    const getActiveOrderCount = () => {
        if (!orderGroup?.orders) return 0;
        return orderGroup.orders.filter(order => !isExcludedFromTotal(order.status)).length;
    };

    if (loading) {
        return <LoadingSpinner message="Loading Invoice..." />;
    }

    if (error || !orderGroup) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">{error || 'Order not found'}</p>
                    <Link to="/orders" className="inline-block border border-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const grandTotal = calculateGrandTotal();
    const hasExcludedOrders = orderGroup.orders?.some(order => isExcludedFromTotal(order.status));

    return (
        <div className="bg-neutral-50 min-h-screen py-10 md:py-14">
            <div className="max-w-3xl mx-auto px-4 sm:px-8">
                
                {/* Back Button */}
                <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-xs text-neutral-400 hover:text-black transition-colors mb-6">
                    ← Back to Orders
                </button>

                {/* Invoice Card */}
                <div className="bg-white border border-neutral-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-light tracking-tight text-black">Invoice</h1>
                            <p className="text-xs text-neutral-400 mt-0.5">Order #{formatOrderId(orderGroup.id)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-400">{formatOrderDate(orderGroup.created_at)}</p>
                        </div>
                    </div>

                    {/* Order Status - Timeline */}
                    <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                        <div className="flex flex-wrap items-center gap-2">
                            {orderGroup.orders?.map((order, index) => {
                                const isLast = index === orderGroup.orders.length - 1;
                                const isExcluded = isExcludedFromTotal(order.status);
                                const sellerName = getOrderSellerName(order);

                                return (
                                    <div key={order.id} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <StatusBadge status={order.status} size="sm" />
                                            <span className={`text-[10px] ${isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-600'}`}>
                                                {sellerName}
                                            </span>
                                        </div>
                                        {!isLast && <span className="text-neutral-300 text-xs">·</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Each Seller's Items */}
                    <div className="divide-y divide-neutral-100">
                        {orderGroup.orders?.map((order) => {
                            const isExcluded = isExcludedFromTotal(order.status);
                            
                            return (
                                <div key={order.id} className={`p-6 ${isExcluded ? 'opacity-60' : ''}`}>
                                    {/* Seller Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${isExcluded ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                                                {getOrderSellerName(order)}
                                            </span>
                                            <StatusBadge status={order.status} size="sm" />
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <OrderItemsList 
                                        items={order.items || []} 
                                        showPrices={true} 
                                        showQuantities={true}
                                        className={isExcluded ? 'opacity-60' : ''}
                                    />

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
                            <p className="text-lg font-light">NPR {Number(grandTotal).toLocaleString()}</p>
                            {hasExcludedOrders && (
                                <p className="text-[9px] text-neutral-400">Excludes cancelled/rejected orders</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invoice;