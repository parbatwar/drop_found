/**
 * @file OrderSummary.jsx
 * @description Component for displaying order pricing summaries, including subtotal, 
 * total delivery fees with optional multi-vendor breakdown details, and the final combined total.
 */

function OrderSummary({ 
    subtotal, 
    deliveryFee, 
    total, 
    showBreakdown = false,
    sellerBreakdown = [],
    className = '',
}) {
    return (
        <div className={`space-y-2.5 pt-4 text-sm ${className}`}>
            <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-900">NPR {Number(subtotal).toLocaleString()}</span>
            </div>
            
            {/* Delivery Fee with Breakdown */}
            <div className="text-neutral-500 border-t border-neutral-100 pt-2">
                <div className="flex justify-between text-xs font-medium text-neutral-600">
                    <span>Delivery Fee</span>
                    <span>NPR {Number(deliveryFee).toLocaleString()}</span>
                </div>
                {showBreakdown && sellerBreakdown.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                        {sellerBreakdown.map((seller) => (
                            <div key={seller.seller_id} className="flex justify-between text-[10px] text-neutral-400 ml-4">
                                <span>{seller.shop_name}</span>
                                <span>NPR {Number(seller.delivery_fee).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between pt-3 border-t border-neutral-100 text-base">
                <span className="font-light text-neutral-600">Total</span>
                <span className="font-medium text-black">NPR {Number(total).toLocaleString()}</span>
            </div>
        </div>
    );
}

export default OrderSummary;