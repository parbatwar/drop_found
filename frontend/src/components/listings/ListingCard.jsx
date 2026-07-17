/**
 * ListingCard - Component for displaying a single product listing card
 * 
 * Renders a product card with image, title, price, and seller type.
 * Used within ListingGrid to display individual listings.
 * Includes hover effects and status overlay for inactive items.
 * 
 * @param {Object} props
 * @param {Object} props.listing - The listing data object
 * @param {number} props.listing.id - Unique listing ID
 * @param {string} props.listing.title - Product title
 * @param {number} props.listing.price - Product price
 * @param {string} props.listing.seller_type - 'thrift' or 'surplus'
 * @param {Array} props.listing.images - Array of image objects
 * @param {string} props.listing.status - 'active' or 'inactive'
 * 
 * @example
 * <ListingCard listing={listingData} />
 */


// components/listings/ListingCard.jsx
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
    // Get the first image or use null
    const imageUrl = listing.images?.[0]?.image_url || null;
    
    // Format price with proper currency display
    const formattedPrice = Number(listing.price).toLocaleString();
    
    // Determine if item is available
    const isAvailable = listing.status === 'active' && listing.quantity > 0;
    const isLowStock = listing.quantity <= 3 && listing.quantity > 0;

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
                {/* Shop Name */}
                {listing.shop_name && (
                    <p className="text-[9px] uppercase tracking-wider text-neutral-400 truncate">
                        {listing.shop_name}
                    </p>
                )}

                {/* Product Title */}
                <h3 className="text-sm font-light text-neutral-800 group-hover:text-black transition-colors duration-200 truncate">
                    {listing.title}
                </h3>

                {/* Price & Seller Type */}
                <div className="flex items-center justify-between pt-0.5">
                    <p className="text-sm font-medium text-neutral-900">
                        NPR {formattedPrice}
                    </p>
                    <span className="text-[8px] uppercase tracking-wider text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded">
                        {listing.seller_type || 'Item'}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ListingCard;