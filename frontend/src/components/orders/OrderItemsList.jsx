/**
 * @file OrderItemsList.jsx
 * @description Component for rendering a list of items within an order, showing individual item thumbnails, 
 * titles, quantities, prices, line totals, and optional seller info with customizable display flags.
 */

function OrderItemsList({ 
    items, 
    showPrices = true,
    showQuantities = true,
    showSeller = false,
    className = '',
}) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-400 text-sm">
                No items found
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item) => {
                const imageUrl = item.listing?.images?.[0]?.image_url || item.image_url || null;
                const title = item.listing?.title || item.title || 'Product';
                const price = item.price_at_purchase || item.price || 0;
                const quantity = item.quantity || 1;
                const total = price * quantity;

                return (
                    <div key={item.id} className="flex items-center gap-4">
                        {/* Thumbnail */}
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

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800">
                                {title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                {showQuantities && (
                                    <>
                                        <span>Qty: {quantity}</span>
                                        {showPrices && <span>·</span>}
                                    </>
                                )}
                                {showPrices && (
                                    <span>NPR {Number(price).toLocaleString()}</span>
                                )}
                                {showSeller && item.seller && (
                                    <>
                                        <span>·</span>
                                        <span>{item.seller.shop_name}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Item Total */}
                        {showPrices && (
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-medium text-neutral-900">
                                    NPR {Number(total).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default OrderItemsList;