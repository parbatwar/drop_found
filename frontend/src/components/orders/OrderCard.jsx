/**
 * @file OrderCard.jsx
 * @description Component for rendering an individual order item card within the orders list, 
 * displaying product details, pricing, seller information, status badges, and action triggers 
 * such as order cancellation and product reviews.
 */

import StatusBadge from '../common/StatusBadge';
import {
    getOrderImageUrl,
    getOrderTitle,
    getOrderItemCount,
    getOrderSellerName,
    canCancelOrder,
    canReviewOrder,
    formatOrderDate,
    formatOrderId,
} from '../../utils/orderUtils';

function OrderCard({ order, onCancel, onReview, showReview }) {
    const imageUrl = getOrderImageUrl(order);
    const title = getOrderTitle(order);
    const itemCount = getOrderItemCount(order);
    const sellerName = getOrderSellerName(order);
    const canCancel = canCancelOrder(order.status);
    const canReview = canReviewOrder(order.status);

    return (
        <div 
            className="border-b border-neutral-100 pb-6 last:border-0 cursor-pointer group hover:bg-neutral-50/30 -mx-2 px-2 rounded-sm transition-colors"
            onClick={() => onReview?.(order.groupId)}
        >
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-neutral-400 tracking-wide">
                            Order #{formatOrderId(order.groupId)}
                        </p>
                        <span className="text-[9px] text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            View invoice →
                        </span>
                    </div>
                    <p className="text-[10px] text-neutral-300">
                        {formatOrderDate(order.groupCreated)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-light">
                        NPR {Number(order.total_amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                        {sellerName}
                    </p>
                </div>
            </div>

            {/* Order Item */}
            <div className="flex items-center gap-4 py-2 hover:bg-neutral-50/50 -mx-2 px-2 rounded-sm transition-colors">
                {/* Thumbnail */}
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-neutral-50 border border-neutral-100">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[6px] uppercase tracking-wider">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-800 truncate">
                            {title}
                        </span>
                        {itemCount > 1 && (
                            <span className="text-xs text-neutral-400 flex-shrink-0">
                                +{itemCount - 1}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-neutral-500">{sellerName}</span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-400">
                            Qty: {order?.items?.[0]?.quantity || 1}
                        </span>
                        {order.payment_method && (
                            <>
                                <span className="text-neutral-300">·</span>
                                <span className="text-[10px] text-neutral-400 uppercase">
                                    {order.payment_method}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={order.status} size="sm" />

                    {canCancel && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel?.(order.id);
                            }}
                            className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                    )}

                    {canReview && !order.review && showReview && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReview?.(order);
                            }}
                            className="text-[10px] text-neutral-400 hover:text-black transition-colors uppercase tracking-wider"
                        >
                            Review
                        </button>
                    )}

                    {order.review && (
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-xs ${
                                        star <= order.review.rating
                                            ? "text-amber-400"
                                            : "text-neutral-200"
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderCard;