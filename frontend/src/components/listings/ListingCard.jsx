// components/listings/ListingCard.jsx
import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  const imageUrl = listing.images?.[0]?.image_url || null;
  const formattedPrice = Number(listing.price).toLocaleString();
  const isAvailable = listing.status === 'active' && listing.quantity > 0;
  const isLowStock = listing.quantity <= 3 && listing.quantity > 0;

  const averageRating = listing.average_rating || 0;
  const totalReviews = listing.total_reviews || 0;
  const hasReviews = totalReviews > 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1;
      const filled = starIndex <= fullStars || (starIndex === fullStars + 1 && hasHalf);

      return (
        <span
          key={starIndex}
          className={`text-[11px] leading-none ${
            filled ? 'text-amber-400' : 'text-neutral-300'
          }`}
        >
          ★
        </span>
      );
    });
  };

  const getTag = () => {
    if (listing.seller_type === 'thrift_shop') return 'Thrift';
    if (listing.seller_type === 'retail_shop' && listing.is_surplus) return 'Surplus';
    return null;
  };

  const tag = getTag();

  // ✅ Contextual colors for Thrift (green) and Surplus (amber)
  const getTagStyles = () => {
    if (tag === 'Thrift') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }
    if (tag === 'Surplus') {
      return 'border-amber-200 bg-amber-50 text-amber-700';
    }
    return 'border-neutral-200 bg-neutral-50 text-neutral-600';
  };

  return (
    <Link
      to={`/product/${listing.id}`}
      className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
    >
      {/* Image Container with a subtle zoom & pop-up smooth animation */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-neutral-400">
            <span className="text-xl">📷</span>
            <span className="text-[10px] tracking-wide">No Image</span>
          </div>
        )}

        {/* Minimal status badges with a smooth popping-in effect on hover */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
          {!isAvailable && (
            <span className="bg-neutral-900 text-white px-2 py-1 text-[9px] font-medium tracking-wider shadow-sm">
              UNAVAILABLE
            </span>
          )}
          {isAvailable && isLowStock && (
            <span className="bg-white/95 backdrop-blur-sm px-2 py-1 text-[9px] font-medium tracking-wider text-neutral-900 shadow-sm border border-neutral-200">
              ONLY {listing.quantity} LEFT
            </span>
          )}
        </div>
      </div>

      {/* Content — Uniqlo style: tight, clean, left-aligned */}
      <div className="mt-3 space-y-1">
        {/* Shop name & Minimal Tag row */}
        {(listing.shop_name || tag) && (
          <div className="flex items-center justify-between gap-2">
            {listing.shop_name ? (
              <p className="truncate text-[11px] tracking-wide text-neutral-500">
                {listing.shop_name}
              </p>
            ) : (
              <span />
            )}
            {tag && (
              <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider ${getTagStyles()}`}>
                {tag}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-[13px] font-normal leading-snug text-neutral-900">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="pt-0.5 text-[13px] font-medium text-neutral-900">
          NPR {formattedPrice}
        </p>

        {/* Rating — secondary, quiet */}
        <div className="flex items-center gap-1.5 pt-0.5 ">
          {hasReviews ? (
            <>
              <div className="flex items-center gap-px" >
                {renderStars(averageRating)}
              </div>
              <span className="text-[11px] text-neutral-500">
                {averageRating.toFixed(1)} ({totalReviews})
              </span>
            </>
          ) : (
            <span className="text-[11px] text-neutral-400">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;