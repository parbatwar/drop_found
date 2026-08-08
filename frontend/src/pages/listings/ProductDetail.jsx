// pages/listings/ProductDetail.jsx - Complete Fixed Version
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useListing } from '../../hooks/useListing';
import { useListingReviews } from '../../hooks/useReview';
import { Icons } from '../../components/Icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';
import { getPriceDisplay, canBuy, getStatusDisplay } from '../../utils/listingUtils';

// Helper function for initials
const getListingInitials = (title) => {
    if (!title) return '?';
    const words = title.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

function ProductDetail() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);

    const {
        listing,
        loading,
        error,
        isWishlisted,
        activeImageIndex,
        addingToCart,
        setActiveImageIndex,
        handleAddToCart,
        handleBuyNow,
        toggleWishlist,
        nextImage,
        prevImage,
    } = useListing(id);

    const {
        reviews,
        averageRating,
        totalReviews,
        loading: reviewsLoading,
        hasMore,
        loadMore,
    } = useListingReviews(id, 5);

    if (loading) return <LoadingSpinner message="Loading Product..." />;

    if (error || !listing) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">{error || 'Listing not found'}</p>
                    <Link 
                        to="/" 
                        className="inline-block border border-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const hasImages = listing.images && listing.images.length > 0;
    const imageCount = hasImages ? listing.images.length : 0;
    const isBuyable = canBuy(listing);
    const statusMessage = getStatusDisplay(listing.status, listing.quantity);

    // Try to get shop name from different possible locations
    const shopName = listing?.seller?.shop_name || 
                     listing?.shop_name || 
                     listing?.seller_shop_name || 
                     'Unknown Shop';

    const shopSlug = listing?.seller?.slug || 
                     listing?.shop_slug || 
                     '';

    const isVerified = listing?.seller?.verified || 
                       listing?.verified || 
                       false;

    const sellerType = listing?.seller_type || 
                       listing?.type || 
                       '';

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* LEFT: IMAGES */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden">
                            {hasImages ? (
                                <>
                                    <img 
                                        src={listing.images[activeImageIndex].image_url} 
                                        alt={listing.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                    {imageCount > 1 && (
                                        <>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] px-3 py-1 rounded-full tracking-wider">
                                                {activeImageIndex + 1} / {imageCount}
                                            </div>
                                            <button 
                                                onClick={prevImage} 
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105"
                                            >
                                                <Icons.ChevronLeft className="w-5 h-5 text-neutral-800" />
                                            </button>
                                            <button 
                                                onClick={nextImage} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105"
                                            >
                                                <Icons.ChevronRight className="w-5 h-5 text-neutral-800" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50">
                                    <span className="text-4xl font-light text-neutral-300">
                                        {getListingInitials(listing.title)}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider mt-2">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>

                        {hasImages && imageCount > 1 && (
                            <div className="grid grid-cols-6 gap-2">
                                {listing.images.map((img, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setActiveImageIndex(index)} 
                                        className={`aspect-square bg-neutral-50 border overflow-hidden transition-all duration-300 ${
                                            activeImageIndex === index 
                                                ? 'border-black' 
                                                : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                    >
                                        <img 
                                            src={img.image_url} 
                                            alt={`Thumbnail ${index + 1}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="space-y-6">
                        {/* Category & Gender */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                {shopName}
                            </span>
                            <span className="w-px h-3 bg-neutral-200"></span>
                            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                {listing.gender || 'Unisex'}
                            </span>
                            <span className="w-px h-3 bg-neutral-200"></span>
                            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                {listing.category_name || 'Uncategorized'}
                            </span>
                        </div>

                        {/* Title & Price */}
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-[26px] font-normal tracking-tight text-neutral-900 leading-snug">
                                {listing.title}
                            </h1>
                            <div className="flex items-baseline gap-3">
                                <p className="text-xl font-normal text-neutral-900">
                                    {getPriceDisplay(listing.price)}
                                </p>
                                {listing.status === "active"}
                            </div>
                        </div>

                        {/* Tags / Badges & Ratings */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-2">
                                {sellerType === "thrift_shop" && (
                                    <span className="text-[10px] uppercase tracking-wider border border-green-200 bg-green-50 text-green-800 px-2.5 py-0.5 rounded">
                                        Thrift
                                    </span>
                                )}
                                {sellerType === "thrift_shop" && listing.condition && (
                                    <span className="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded capitalize">
                                        {listing.condition.replace("_", " ")}
                                    </span>
                                )}
                            </div>

                            {totalReviews > 0 && (
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <StarRating rating={averageRating} />
                                    <span className="text-xs font-light text-neutral-800">{averageRating.toFixed(1)}</span>
                                    <span className="text-[10px] text-neutral-400">({totalReviews})</span>
                                </div>
                            )}
                        </div>

                        {/* Size Display Info */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-neutral-500">
                                    Size: <strong className="font-medium text-neutral-900 uppercase">{listing.size?.replace('_', ' ') || 'One Size'}</strong>
                                </span>
                            </div>
                        </div>


                        {/* Description */}
                        {listing.description && (
                            <div className="pt-2">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">Description</p>
                                <p className="text-xs text-neutral-600 leading-relaxed">{listing.description}</p>
                            </div>
                        )}

                        {/* Actions & Quantity */}
                        <div className="space-y-4 pt-4">
                            {isBuyable ? (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                                            <button 
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))} 
                                                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-200/50 transition-colors text-neutral-700"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center text-xs font-medium text-neutral-900">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity((q) => Math.min(listing.quantity, q + 1))} 
                                                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-200/50 transition-colors text-neutral-700"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>


                                    </div>

                                    {listing.quantity <= 3 && listing.quantity > 0 && (
                                        <p className="text-[10px] text-amber-600 uppercase tracking-wider">
                                            Only {listing.quantity} left in stock
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleBuyNow(quantity)} 
                                            className="border border-black text-black py-3.5 text-[11px] tracking-[0.2em] uppercase rounded-full hover:bg-black hover:text-white transition-colors"
                                        >
                                            Buy Now
                                        </button>
                                        <button 
                                            onClick={() => handleAddToCart(quantity)} 
                                            disabled={addingToCart} 
                                            className="bg-black text-white py-3.5 px-6 text-[11px] tracking-[0.2em] uppercase rounded-full hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addingToCart ? "Adding..." : "Add to Cart"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full border border-neutral-200 py-4 text-center text-[11px] text-neutral-400 uppercase tracking-[0.2em] bg-neutral-50 rounded-full">
                                    {statusMessage}
                                </div>
                            )}

                            {/* Secondary Actions: Share & Wishlist */}
                            <div className="flex items-center gap-2 pt-2">


                                <button 
                                    onClick={toggleWishlist} 
                                    className="flex-1 flex items-center justify-center gap-2 border border-neutral-200 py-3 px-4 text-[10px] uppercase tracking-[0.2em] rounded-full hover:border-neutral-900 transition-colors text-neutral-800"
                                >
                                    <Icons.Heart className="w-4 h-4" filled={isWishlisted} />
                                    {isWishlisted ? "Remove from Wishlist" : "Add to Wish list"}
                                </button>
                            </div>

                            {/* Shipping info */}
                            <div className="pt-3 border-t border-neutral-100">
                                <p className="text-[11px] text-neutral-500">
                                    SHIPS FREE: For orders over NPR 5,000.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-neutral-100 pt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400">
                            Customer Reviews
                        </h2>
                    </div>

                    {reviewsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                                Loading Reviews...
                            </div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="border border-neutral-200 bg-neutral-50 p-12 text-center">
                            <p className="text-sm text-neutral-400 uppercase tracking-wider">No reviews yet</p>
                            <p className="text-[10px] text-neutral-300 mt-1">Be the first to leave a review</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-neutral-600">
                                                        {review.buyer?.first_name?.[0] || '?'}
                                                        {review.buyer?.last_name?.[0] || ''}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-neutral-800">
                                                            {review.buyer?.first_name || 'Anonymous'}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <StarRating rating={review.rating} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-neutral-600 mt-2 ml-11 leading-relaxed">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-neutral-400 flex-shrink-0 ml-4">
                                                {new Date(review.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 text-center">
                                    <button 
                                        onClick={loadMore} 
                                        className="border border-neutral-200 px-8 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Load More Reviews
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;