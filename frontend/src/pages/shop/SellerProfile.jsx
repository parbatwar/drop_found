// src/pages/shop/SellerProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSeller } from '../../api/seller';
import { getSellerListings } from '../../api/listings';
import { followSeller, unfollowSeller } from '../../api/follow';
import { useAuth } from '../../context/AuthContext';

// SVG Icons
const Icons = {
    Location: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Grid: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    Package: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    Users: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Verified: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
};

function SellerProfile() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

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
            } else {
                await followSeller(seller.id);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };

    // Get initials for placeholder
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
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

                    {/* Stats */}
                    <div className="flex gap-8 mt-6 pt-6 border-t border-neutral-100">
                        <div>
                            <p className="text-lg font-light">{listings.length}</p>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Items</p>
                        </div>
                        <div>
                            <p className="text-lg font-light">{seller.followers_count || 0}</p>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Followers</p>
                        </div>
                        <div>
                            <p className="text-lg font-light">{seller.following_count || 0}</p>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Following</p>
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
            </div>
        </div>
    );
}

export default SellerProfile;