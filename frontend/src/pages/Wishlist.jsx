// pages/Wishlist.jsx - Refactored Version
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { useToast } from "../hooks/useToast";
import { Icons } from "../components/Icons";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Wishlist() {
    const { showToast } = useToast();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const res = await getWishlist();
            setWishlist(res.data || []);
        } catch (err) {
            console.error(err);
            showToast('Failed to load wishlist', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = (listingId) => {
        setItemToRemove(listingId);
        setShowConfirm(true);
    };

    const confirmRemove = async () => {
        if (!itemToRemove) return;
        setRemoving(true);
        try {
            await removeFromWishlist(itemToRemove);
            setWishlist((prev) => prev.filter((item) => item.listing.id !== itemToRemove));
            showToast('Item removed from wishlist', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to remove item', 'error');
        } finally {
            setRemoving(false);
            setShowConfirm(false);
            setItemToRemove(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading Wishlist..." />;
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
                    <EmptyState
                        icon="♡"
                        title="No saved items yet"
                        subtitle="Start exploring and save items you love."
                        actionLabel="Start Shopping"
                        actionLink="/"
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="group relative">
                                <Link to={`/product/${item.listing.id}`} className="block">
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
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[9px] uppercase tracking-wider bg-white/90 px-2 py-0.5 border border-neutral-200">
                                                ♥ Saved
                                            </span>
                                        </div>
                                    </div>

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

                                <button
                                    onClick={() => handleRemoveClick(item.listing.id)}
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

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => {
                    setShowConfirm(false);
                    setItemToRemove(null);
                }}
                onConfirm={confirmRemove}
                title="Remove from Wishlist"
                message="Are you sure you want to remove this item from your wishlist?"
                confirmLabel="Remove"
                confirmVariant="danger"
                loading={removing}
            />
        </div>
    );
}

export default Wishlist;