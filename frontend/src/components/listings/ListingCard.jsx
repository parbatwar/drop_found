// components/listings/ListingCard.jsx
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
    const imageUrl = listing.images?.[0]?.image_url || null;
    const formattedPrice = Number(listing.price).toLocaleString();
    const isAvailable = listing.status === 'active' && listing.quantity > 0;
    const isLowStock = listing.quantity <= 3 && listing.quantity > 0;

    // ✅ Determine the tag to display
    const getTag = () => {
        // Only show tags for:
        // 1. Thrift items (always show "Thrift")
        // 2. Surplus items (show "Surplus")
        if (listing.seller_type === 'thrift') {
            return 'Thrift';
        }
        if (listing.seller_type === 'retailer') {
            if (listing.is_surplus) return 'Surplus';
            return null; // Regular retailer - show nothing
        }
        return null;
    };

    const tag = getTag();

    // ✅ Get tag styling
    const getTagStyles = () => {
        if (listing.seller_type === 'retailer') {
            if (listing.is_surplus) {
                return 'text-amber-600 border-amber-200 bg-amber-50';
            }
        }
        if (listing.seller_type === 'thrift') {
            return 'text-neutral-400 border-neutral-200';
        }
        return '';
    };

    return (
        <Link to={`/product/${listing.id}`} className="group block">
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-neutral-50 border border-neutral-100 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                        <span className="text-2xl font-light">📷</span>
                        <span className="text-[9px] uppercase tracking-wider mt-1">No Image</span>
                    </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
                    {listing.section && (
                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-medium bg-white/90 text-black border border-neutral-200 backdrop-blur-sm">
                            {listing.section}
                        </span>
                    )}
                    {!isAvailable && (
                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-medium bg-black/80 text-white backdrop-blur-sm">
                            Unavailable
                        </span>
                    )}
                    {isAvailable && isLowStock && (
                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-medium bg-amber-500/90 text-white backdrop-blur-sm">
                            Only {listing.quantity} left
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mt-2.5 space-y-0.5">
                {listing.shop_name && (
                    <p className="text-[9px] uppercase tracking-wider text-neutral-400 truncate">
                        {listing.shop_name}
                    </p>
                )}

                <h3 className="text-sm font-light text-neutral-800 group-hover:text-black transition-colors duration-200 truncate">
                    {listing.title}
                </h3>

                <div className="flex items-center justify-between pt-0.5">
                    <p className="text-sm font-medium text-neutral-900">
                        NPR {formattedPrice}
                    </p>
                    {tag && (
                        <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${getTagStyles()}`}>
                            {tag}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default ListingCard;