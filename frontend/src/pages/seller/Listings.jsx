// pages/seller/Listings.jsx - Refactored with ConfirmDialog
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, deleteListing } from '../../api/listings';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

function Listings() {
    const { showToast } = useToast();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const res = await getMyListings();
            setListings(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load listings.');
            showToast('Failed to load listings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (listing) => {
        setListingToDelete(listing);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!listingToDelete) return;
        setDeleting(true);
        try {
            await deleteListing(listingToDelete.id);
            setListings(listings.filter((l) => l.id !== listingToDelete.id));
            showToast('Listing deleted successfully', 'success');
        } catch (err) {
            console.error('Delete failed:', err);
            showToast('Failed to delete listing', 'error');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
            setListingToDelete(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading Stock Matrix..." />;
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <p className="text-xs uppercase tracking-widest text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-neutral-900 py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 border-b border-neutral-100 pb-8">
                    <div className="space-y-2">
                        <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                            Studio / Distribution Hub
                        </span>
                        <h1 className="text-3xl font-light tracking-[0.08em] text-black uppercase">
                            My Listings
                        </h1>
                    </div>
                    <Link
                        to="/seller/listings/new"
                        className="inline-block bg-black text-white text-center px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300 rounded-sm"
                    >
                        + Add Listing
                    </Link>
                </div>

                {/* Empty State */}
                {listings.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="No listings found"
                        subtitle="Create your first listing to start selling."
                        actionLabel="Add Listing"
                        actionLink="/seller/listings/new"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {listings.map((item) => {
                            const coverImage = item.images && item.images.length > 0 
                                ? item.images.find(img => img.display_order === 0) || item.images[0]
                                : null;

                            return (
                                <div key={item.id} className="group flex flex-col h-full space-y-4">
                                    
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden rounded-sm border border-neutral-100">
                                        {coverImage ? (
                                            <img
                                                src={coverImage.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                                                <span className="text-[10px] tracking-widest text-neutral-300 uppercase font-light">
                                                    No Visual Asset
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Status Pill */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 border border-neutral-200/40 rounded-xs">
                                            <span className="text-[9px] tracking-widest uppercase text-black font-medium">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-grow space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-light text-black tracking-wide truncate max-w-[75%]">
                                                {item.title}
                                            </h3>
                                            <span className="text-xs font-medium text-neutral-900 tracking-wider pt-0.5">
                                                NPR {Number(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
                                            <span className="capitalize">{item.category_name}</span>
                                            {item.size && (
                                                <>
                                                    <span className="text-neutral-200">•</span>
                                                    <span>Size {item.size.toUpperCase()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-4 pt-2 border-t border-neutral-100">
                                        <Link
                                            to={`/seller/listings/${item.id}/edit`}
                                            className="text-[10px] tracking-widest uppercase font-medium text-neutral-500 hover:text-black underline underline-offset-4 transition-colors duration-200"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(item)}
                                            className="text-[10px] tracking-widest uppercase font-medium text-red-400 hover:text-red-600 transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setListingToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Listing"
                message={`Are you sure you want to delete "${listingToDelete?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                confirmVariant="danger"
                loading={deleting}
            />
        </div>
    );
}

export default Listings;