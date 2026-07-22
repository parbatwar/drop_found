// pages/shop/SellerProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSeller } from '../../api/seller';
import { getSellerListings } from '../../api/listings';
import { followSeller, unfollowSeller } from '../../api/follow';
import { useAuth } from '../../context/AuthContext';
import { useSellerReviews } from '../../hooks/useReview';
import { Icons } from '../../components/Icons';
import FollowersModal from '../../components/FollowersModal';

function SellerProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);

    // Fetch seller reviews
    const {
        reviews,
        averageRating,
        totalReviews,
        loading: reviewsLoading,
        hasMore,
        loadMore,
    } = useSellerReviews(seller?.id, 5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellerRes = await getSeller(slug);
                setSeller(sellerRes.data);
                setIsFollowing(sellerRes.data.is_following);

                const listingsRes = await getSellerListings(sellerRes.data.id);
                setListings(listingsRes.data);
            } catch (err) {
                console.error(err);
                setError('Seller not found');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleFollow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isFollowing) {
                await unfollowSeller(seller.id);
                setIsFollowing(false);
                // Update follower count
                setSeller(prev => ({
                    ...prev,
                    followers_count: prev.followers_count - 1
                }));
            } else {
                await followSeller(seller.id);
                setIsFollowing(true);
                // Update follower count
                setSeller(prev => ({
                    ...prev,
                    followers_count: prev.followers_count + 1
                }));
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <span key={i} className="text-amber-500 text-sm">★</span>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-amber-500 text-sm">★</span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-neutral-200 text-sm">★</span>
                );
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Shop...
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl font-light text-neutral-200 mb-4">404</div>
                    <p className="text-sm text-neutral-400 mb-6">{error || 'Shop not found'}</p>
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

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-wider">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-neutral-600">{seller.shop_name}</span>
                    </nav>
                </div>

                {/* Shop Header */}
                <div className="border-b border-neutral-100 pb-8 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Logo/Avatar */}
                            {seller.avatar_url ? (
                                <img
                                    src={seller.avatar_url}
                                    alt={seller.shop_name}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-neutral-200"
                                />
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-400 text-xl font-light">
                                    {getInitials(seller.shop_name)}
                                </div>
                            )}
                            
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl md:text-3xl font-light tracking-tight text-black">
                                        {seller.shop_name}
                                    </h1>
                                    {seller.verification_status === 'approved' && (
                                        <span className="text-blue-600" title="Verified Seller">
                                            <Icons.Verified className="w-5 h-5" />
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                                        {seller.seller_type || 'Curator'}
                                    </span>
                                    {seller.location && (
                                        <>
                                            <span className="w-px h-3 bg-neutral-300"></span>
                                            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                                                <Icons.Location className="w-3 h-3" />
                                                {seller.location}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Follow Button */}
                        {user?.id !== seller.user_id && (
                            <button
                                onClick={handleFollow}
                                className={`px-8 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                                    isFollowing
                                        ? "bg-black text-white hover:bg-neutral-800"
                                        : "border border-neutral-200 text-black hover:border-black hover:bg-black hover:text-white"
                                }`}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        )}
                    </div>

                    {/* Bio */}
                    {seller.bio && (
                        <p className="text-sm text-neutral-600 mt-4 max-w-2xl leading-relaxed">
                            {seller.bio}
                        </p>
                    )}

                    {/* ✅ Stats - Show Followers here (public) */}
                    <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-neutral-100">
                        <div>
                            <p className="text-lg font-light">{listings.length}</p>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Items</p>
                        </div>
                        
                        {/* ✅ Followers - Only on shop page */}
                        <div>
                            <button
                                onClick={() => setShowFollowersModal(true)}
                                className="text-left hover:opacity-70 transition-opacity group"
                            >
                                <p className="text-lg font-light">
                                    {seller.followers_count || 0}
                                </p>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                                    Followers
                                    <span className="text-[8px] text-neutral-300">↗</span>
                                </p>
                            </button>
                        </div>
                        
                        <div>
                            <p className="text-lg font-light">{totalReviews}</p>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                {totalReviews === 1 ? 'Review' : 'Reviews'}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-light">{averageRating.toFixed(1)}</span>
                            </div>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                {renderStars(averageRating)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Listings */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400">
                            Items from this shop
                        </h2>
                        <span className="text-[10px] text-neutral-400">
                            {listings.length} items
                        </span>
                    </div>

                    {listings.length === 0 ? (
                        <div className="border border-neutral-200 bg-neutral-50 p-12 text-center">
                            <div className="text-4xl font-light text-neutral-300 mb-2">🛍️</div>
                            <p className="text-sm text-neutral-400 uppercase tracking-wider">
                                No items listed yet
                            </p>
                            <p className="text-[10px] text-neutral-300 mt-1">
                                Check back soon for new drops
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listings.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="group"
                                >
                                    <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 overflow-hidden mb-3 relative">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0].image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300 text-xs uppercase tracking-wider">
                                                No Image
                                            </div>
                                        )}
                                        {item.status === 'inactive' && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white text-[10px] uppercase tracking-widest bg-black/60 px-3 py-1">
                                                    Unavailable
                                                </span>
                                            </div>
                                        )}
                                        {item.quantity === 0 && item.status === 'active' && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white text-[10px] uppercase tracking-widest bg-black/60 px-3 py-1">
                                                    Sold Out
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-light text-neutral-800 group-hover:text-black transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mt-0.5">
                                        NPR {Number(item.price).toLocaleString()}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-neutral-100 pt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400">
                            Customer Reviews
                        </h2>
                        <span className="text-[10px] text-neutral-400">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </span>
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

            {/* ✅ Followers Modal - Shows who follows this shop */}
            <FollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                sellerId={seller.id}
                sellerName={seller.shop_name}
                sellerAvatar={seller.avatar_url}
            />
        </div>
    );
}

export default SellerProfile;