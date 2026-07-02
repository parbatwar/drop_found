import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing } from '../../api/listings';

function ProductDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

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

    const nextImage = () => {
        if (!listing?.images) return;
        setActiveIndex((prev) => (prev + 1) % listing.images.length);
    };

    const prevImage = () => {
        if (!listing?.images) return;
        setActiveIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b border-black"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
                <p className="text-neutral-400 text-xs uppercase tracking-widest">{error || 'Listing not found'}</p>
                <Link to="/" className="text-xs uppercase tracking-widest text-black border-b border-black pb-0.5 inline-block hover:opacity-60 transition-opacity">
                    Back to Home
                </Link>
            </div>
        );
    }

    const hasImages = listing.images && listing.images.length > 0;

    return (
        <div className="bg-white min-h-screen text-neutral-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* 2-Column High-Density Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
                    
                    {/* LEFT SIDE: MUJI STRUCTURAL LAYOUT */}
                    <div className="space-y-4">
                        {/* 1:1 Aspect-Square Main Viewport Box */}
                        <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden group">
                            {hasImages ? (
                                <>
                                    <img
                                        src={listing.images[activeIndex].image_url}
                                        alt={`${listing.title} - View ${activeIndex + 1}`}
                                        className="w-full h-full object-contain p-6"
                                    />
                                    
                                    {/* Muji-Inspired Square Arrow Overlays */}
                                    {listing.images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-12 bg-black/80 text-white flex items-center justify-center hover:bg-black transition-colors"
                                                aria-label="Previous view"
                                            >
                                                <span className="text-xs">&#10216;</span>
                                            </button>
                                            <button 
                                                onClick={nextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-12 bg-black/80 text-white flex items-center justify-center hover:bg-black transition-colors"
                                                aria-label="Next view"
                                            >
                                                <span className="text-xs">&#10217;</span>
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs tracking-widest uppercase">
                                    No Image Provided
                                </div>
                            )}
                        </div>

                        {/* Flat Row Micro-Thumbnails Below */}
                        {hasImages && listing.images.length > 1 && (
                            <div className="flex flex-wrap gap-2.5">
                                {listing.images.map((img, index) => (
                                    <button
                                        key={img.id || index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-16 aspect-square bg-neutral-50 border overflow-hidden p-1 transition-all ${
                                            activeIndex === index 
                                                ? 'border-black shadow-sm' 
                                                : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                    >
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: SIGNATURE HIGH-DENSITY EDITORIAL DATA PANEL */}
                    <div className="space-y-8">
                        {/* Title and Pricing Block */}
                        <div className="space-y-3 pb-6 border-b border-neutral-100">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block">
                                    Collection / {listing.category?.replace('_', ' ')}
                                </span>
                                {listing.section && (
                                    <span className="px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase font-semibold bg-neutral-100 text-neutral-800 rounded-sm border border-neutral-200/40">
                                        {listing.section}
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-black leading-tight uppercase">
                                {listing.title}
                            </h1>
                            <p className="text-xl font-light text-neutral-900">
                                NPR {Number(listing.price).toLocaleString()}
                            </p>
                        </div>

                        {/* Description Story */}
                        {listing.description && (
                            <div className="space-y-1.5">
                                <h4 className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">Story</h4>
                                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md font-light">
                                    {listing.description}
                                </p>
                            </div>
                        )}

                        {/* Structured Specification Metrics Grid */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-6 border-t border-b border-neutral-100 text-xs">
                            {listing.size && (
                                <div>
                                    <span className="text-[10px] tracking-wider text-neutral-400 uppercase block mb-0.5">Size</span>
                                    <span className="font-normal uppercase text-black">{listing.size.replace('_', ' ')}</span>
                                </div>
                            )}
                            {listing.condition && (
                                <div>
                                    <span className="text-[10px] tracking-wider text-neutral-400 uppercase block mb-0.5">Condition</span>
                                    <span className="font-normal capitalize text-black">{listing.condition.replace('_', ' ')}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-[10px] tracking-wider text-neutral-400 uppercase block mb-0.5">Status</span>
                                <span className="font-normal capitalize text-black">{listing.status}</span>
                            </div>
                        </div>

                        {/* Main Call to Action Button */}
                        <div className="pt-2">
                            {listing.status === 'active' ? (
                                <button
                                    className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <div className="w-full border border-neutral-200 py-4 text-center text-xs text-neutral-400 uppercase tracking-[0.25em] bg-neutral-50">
                                    {listing.status === 'sold' ? 'Piece Sold Out' : 'Archived / Unavailable'}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetail;