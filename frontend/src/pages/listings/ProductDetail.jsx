// pages/listings/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListing } from '../../api/listings';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from "../../api/cart";
import { addToWishlist, removeFromWishlist } from "../../api/wishlist";
import { useListingReviews } from '../../hooks/useReview';
import { Icons } from '../../components/Icons';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const canBuy = listing && listing.status === "active" && listing.quantity > 0;

    // Fetch product reviews
    const {
        reviews,
        averageRating,
        totalReviews,
        loading: reviewsLoading,
        hasMore,
        loadMore,
    } = useListingReviews(id, 5);

    useEffect(() => {
        getListing(id)
            .then((res) => {
                setListing(res.data);
                setActiveIndex(0);
            })
            .catch((err) => {
                console.error(err);
                setError('Listing not found');
            })
            .finally(() => setLoading(false)); 
    }, [id]);

    useEffect(() => {
        if (listing) {
            setIsWishlisted(listing.is_wishlisted);
        }
    }, [listing]);

    const handleCheckoutRedirect = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { listing } });
    };

    const nextImage = () => {
        if (!listing?.images) return;
        setActiveIndex((prev) => (prev + 1) % listing.images.length);
    };

    const prevImage = () => {
        if (!listing?.images) return;
        setActiveIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            setAddingToCart(true);
            await addToCart({
                listing_id: listing.id,
                quantity: quantity,
            });
            alert("Added to cart!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate("/checkout", {
            state: {
                listing,
                quantity,
                quickBuy: true,
            },
        });
    };

    const handleWishlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            if (isWishlisted) {
                await removeFromWishlist(listing.id);
                setIsWishlisted(false);
            } else {
                await addToWishlist(listing.id);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    // Get initials for placeholder
    const getInitials = (title) => {
        if (!title) return '?';
        const words = title.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={`text-sm ${i <= roundedRating ? 'text-amber-500' : 'text-neutral-200'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Product...
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">
                        {error || 'Listing not found'}
                    </p>
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

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-14">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* LEFT SIDE: IMAGES */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden">
                            {hasImages ? (
                                <>
                                    <img 
                                        src={listing.images[activeIndex].image_url} 
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Image Counter */}
                                    {imageCount > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[9px] px-3 py-1 rounded-full tracking-wider">
                                            {activeIndex + 1} / {imageCount}
                                        </div>
                                    )}
                                    
                                    {/* Navigation Arrows */}
                                    {imageCount > 1 && (
                                        <>
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
                                        {getInitials(listing.title)}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider mt-2">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {hasImages && imageCount > 1 && (
                            <div className="grid grid-cols-6 gap-2">
                                {listing.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`aspect-square bg-neutral-50 border overflow-hidden transition-all duration-300 ${
                                            activeIndex === index 
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

                    {/* RIGHT SIDE: PRODUCT INFO */}
                    <div className="space-y-8">
                        {/* Category & Title */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                                    {listing.category_name || 'Uncategorized'}
                                </span>
                                <span className="w-px h-3 bg-neutral-300"></span>
                                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                                    {listing.gender || 'Unisex'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black leading-tight">
                                {listing.title}
                            </h1>
                            <p className="text-2xl font-light text-neutral-900">
                                NPR {Number(listing.price).toLocaleString()}
                            </p>
                        </div>
                    

                        {/* Tags & Reviews */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-[10px] uppercase tracking-widest border border-neutral-200 px-3 py-1">
                                    {listing.seller_type === "thrift" ? "Thrift" : "Retailer"}
                                </span>
                                {listing.status === "active" && (
                                    <span className="text-[10px] uppercase tracking-widest bg-green-50 text-green-700 px-3 py-1 border border-green-200">
                                        In Stock
                                    </span>
                                )}
                                {listing.quantity <= 3 && listing.quantity > 0 && (
                                    <span className="text-[10px] uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 border border-amber-200">
                                        Only {listing.quantity} left
                                    </span>
                                )}
                            </div>

                            {/* Reviews - Right aligned */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {totalReviews > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center">
                                            {renderStars(averageRating)}
                                        </div>
                                        <span className="text-sm font-light">{averageRating.toFixed(1)}</span>
                                    </div>
                                )}
                                <span className="text-[10px] text-neutral-400">
                                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-neutral-100">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
                                    Size
                                </p>
                                <p className="text-sm uppercase text-black">
                                    {listing.size?.replace('_', ' ') || 'One Size'}
                                </p>
                            </div>
                            {listing.seller_type === "thrift" && (
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
                                        Condition
                                    </p>
                                    <p className="text-sm capitalize text-black">
                                        {listing.condition?.replace("_", " ") || 'Not specified'}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
                                    Quantity
                                </p>
                                <p className="text-sm text-black">
                                    {listing.quantity} available
                                </p>
                            </div>
                            {listing.seller && (
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
                                        Seller
                                    </p>
                                    <Link 
                                        to={`/shop/${listing.seller.slug}`}
                                        className="text-sm text-black hover:underline transition-colors"
                                    >
                                        {listing.seller.shop_name}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
                                    Description
                                </p>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    {listing.description}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3 pt-4">
                            {canBuy ? (
                                <>
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-4 py-1">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                                            Quantity
                                        </label>
                                        <div className="flex items-center border border-neutral-200">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center text-sm">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => Math.min(listing.quantity, q + 1))}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {listing.quantity <= 3 && (
                                            <span className="text-[9px] text-amber-600 uppercase tracking-wider">
                                                Only {listing.quantity} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Buy Now & Add to Cart */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleBuyNow}
                                            className="bg-black text-white py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors"
                                        >
                                            Buy Now
                                        </button>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addingToCart}
                                            className="border border-black py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addingToCart ? "Adding..." : "Add to Cart"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full border border-neutral-200 py-4 text-center text-[11px] text-neutral-400 uppercase tracking-[0.25em] bg-neutral-50">
                                    {listing?.status === "inactive"
                                        ? "Currently Unavailable"
                                        : "Sold Out"}
                                </div>
                            )}

                            {/* Wishlist Button */}
                            <button
                                onClick={handleWishlist}
                                className="w-full flex items-center justify-center gap-2 border border-neutral-200 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-black transition-colors"
                            >
                                <Icons.Heart className="w-4 h-4" filled={isWishlisted} />
                                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
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
                            <p className="text-sm text-neutral-400 uppercase tracking-wider">
                                No reviews yet
                            </p>
                            <p className="text-[10px] text-neutral-300 mt-1">
                                Be the first to leave a review
                            </p>
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
                                                            {renderStars(review.rating)}
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

                            {/* Load More Button */}
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