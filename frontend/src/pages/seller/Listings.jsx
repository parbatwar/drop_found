import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSellerListings, deleteListing } from '../../api/listings'; // Ensure getSellerListings is linked to /listings/seller/{id}
import { getMySellerProfile } from '../../api/seller';

function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch the profile parameters to resolve the target identity string context safely
                const sellerRes = await getMySellerProfile();
                const sellerId = sellerRes.data.id;

                // 2. Directly call the optimized seller endpoint instead of filtering the whole global collection
                const listingsRes = await getSellerListings(sellerId);
                console.log("RAW LISTINGS DATA FROM BACKEND:", listingsRes.data);
                setListings(listingsRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to securely pull repository inventory metadata.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('This action permanently expunges the asset record. Proceed?')) return;
        try {
            await deleteListing(id);
            setListings(listings.filter((l) => l.id !== id));
        } catch (err) {
            console.error('Delete execution failure:', err);
            alert('Failed to remove asset record from cluster.');
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Stock Matrix...
                </div>
            </div>
        );
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
                
                {/* Minimal Header Block */}
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
                        + Create Placement
                    </Link>
                </div>

                {/* Empty State */}
                {listings.length === 0 ? (
                    <div className="border border-dashed border-neutral-200 py-24 text-center rounded-sm bg-neutral-50">
                        <p className="text-xs tracking-widest uppercase text-neutral-400">
                            No inventory variants registered in this vault.
                        </p>
                    </div>
                ) : (
                    /* Brutalist Luxury Responsive Core Grid Layout */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {listings.map((item) => {
                            // Safely extract the root thumbnail pointer based on display order sorting
                            const coverImage = item.images && item.images.length > 0 
                                ? item.images.find(img => img.display_order === 0) || item.images[0]
                                : null;

                            return (
                                <div key={item.id} className="group flex flex-col h-full space-y-4">
                                    
                                    {/* Image Display Shell */}
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
                                        
                                        {/* Minimal Corner Status Pill */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 border border-neutral-200/40 rounded-xs">
                                            <span className="text-[9px] tracking-widest uppercase text-black font-medium">
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Typography Metadata Parameters */}
                                    <div className="flex flex-col flex-grow space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-light text-black tracking-wide truncate max-w-[75%]">
                                                {item.title}
                                            </h3>
                                            <span className="text-xs font-medium text-neutral-900 tracking-wider pt-0.5">
                                                NPR {parseFloat(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
                                            <span className="capitalize">{item.category.replaceAll('_', ' ')}</span>
                                            {item.size && (
                                                <>
                                                    <span className="text-neutral-200">•</span>
                                                    <span>Size {item.size.toUpperCase()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* System Modification Control Drawer */}
                                    <div className="flex items-center space-x-4 pt-2 border-t border-neutral-100">
                                        <Link
                                            to={`/seller/listings/${item.id}/edit`}
                                            className="text-[10px] tracking-widest uppercase font-medium text-neutral-500 hover:text-black underline underline-offset-4 transition-colors duration-200"
                                        >
                                            Edit Specs
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="text-[10px] tracking-widest uppercase font-medium text-red-400 hover:text-red-600 transition-colors duration-200"
                                        >
                                            Decommission
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Listings;