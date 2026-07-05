import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListing } from '../../api/listings';
import { useAuth } from '../../context/AuthContext';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

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

    const handleCheckoutRedirect = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Redirect to a dedicated checkout page and pass item info via state
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

    if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b border-black"></div></div>;
    if (error || !listing) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-xs uppercase tracking-widest text-neutral-400 mb-4">{error || 'Listing not found'}</p><Link to="/" className="text-xs uppercase tracking-widest text-black border-b border-black pb-0.5">Back to Home</Link></div>;

    const hasImages = listing.images && listing.images.length > 0;

    return (
        <div className="bg-white min-h-screen text-neutral-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
                    
                    {/* LEFT SIDE: IMAGES */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden">
                            {hasImages ? (
                                <>
                                    <img src={listing.images[activeIndex].image_url} alt="" className="w-full h-full object-contain p-6" />
                                    {listing.images.length > 1 && (
                                        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                                            <button onClick={prevImage} className="pointer-events-auto w-10 h-12 bg-black/80 text-white flex items-center justify-center text-xs">&#10216;</button>
                                            <button onClick={nextImage} className="pointer-events-auto w-10 h-12 bg-black/80 text-white flex items-center justify-center text-xs">&#10217;</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs uppercase tracking-widest">No Image</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: INFO & BUTTON */}
                    <div className="space-y-8">
                        <div className="space-y-3 pb-6 border-b border-neutral-100">
                            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block">Collection / {listing.category?.replace('_', ' ')}</span>
                            <h1 className="text-2xl sm:text-3xl font-light text-black uppercase">{listing.title}</h1>
                            <p className="text-xl font-light text-neutral-900">NPR {Number(listing.price).toLocaleString()}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-6 border-t border-b border-neutral-100 text-xs">
                            <div><span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Size</span><span className="font-normal uppercase text-black">{listing.size?.replace('_', ' ')}</span></div>
                            <div><span className="text-[10px] text-neutral-400 uppercase block mb-0.5">Condition</span><span className="font-normal capitalize text-black">{listing.condition?.replace('_', ' ')}</span></div>
                        </div>

                        <div className="pt-2">
                            {listing.status === 'active' ? (
                                <button
                                    onClick={handleCheckoutRedirect}
                                    className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <div className="w-full border border-neutral-200 py-4 text-center text-xs text-neutral-400 uppercase tracking-[0.25em] bg-neutral-50">
                                    Piece Sold Out
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