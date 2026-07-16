// pages/Wishlist.jsx
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { Link } from "react-router-dom";

// SVG Icons
const Icons = {
    Heart: ({ className = "w-5 h-5", filled = false }) => (
        <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    Trash: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    EmptyHeart: ({ className = "w-16 h-16" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
};

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const res = await getWishlist();
            setWishlist(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (listingId) => {
        try {
            await removeFromWishlist(listingId);
            setWishlist((prev) =>
                prev.filter((item) => item.listing.id !== listingId)
            );
        } catch (err) {
            console.error(err);
            alert("Failed to remove item.");
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Wishlist...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                                Wishlist
                            </span>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                                Saved Items
                            </h1>
                            <p className="text-sm text-neutral-500 mt-2">
                                Items you've saved for later.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-light text-neutral-300">
                                {wishlist.length}
                            </span>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                Items
                            </p>
                        </div>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                        <div className="flex justify-center mb-4 text-neutral-300">
                            <Icons.EmptyHeart className="w-20 h-20" />
                        </div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">
                            No saved items yet
                        </p>
                        <p className="text-[10px] text-neutral-300 mt-2">
                            Start exploring and save items you love.
                        </p>
                        <Link 
                            to="/" 
                            className="inline-block mt-6 border border-black px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="group relative"
                            >
                                <Link to={`/product/${item.listing.id}`} className="block">
                                    {/* Product Image */}
                                    <div className="aspect-square bg-neutral-50 border border-neutral-100 overflow-hidden mb-3 relative">
                                        {item.listing.images?.[0]?.image_url ? (
                                            <img
                                                src={item.listing.images[0].image_url}
                                                alt={item.listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs uppercase tracking-wider bg-neutral-50">
                                                No Image
                                            </div>
                                        )}
                                        
                                        {/* Wishlist Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[9px] uppercase tracking-wider bg-white/90 px-2 py-0.5 border border-neutral-200">
                                                ♥ Saved
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-light text-neutral-800 group-hover:text-black transition-colors truncate">
                                            {item.listing.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-neutral-900">
                                                NPR {Number(item.listing.price).toLocaleString()}
                                            </p>
                                            <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                {item.listing.seller_type || 'Item'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Remove Button - Appears on Hover */}
                                <button
                                    onClick={() => handleRemove(item.listing.id)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500"
                                    aria-label="Remove from wishlist"
                                >
                                    <Icons.Trash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;