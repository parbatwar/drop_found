import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListing } from '../../api/listings';
import { getSellerBySlug } from '../../api/seller';

function ProductDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getListing(id)
            .then((res) => {
                setListing(res.data);
                return res.data;
            })
            .catch((err) => {
                console.error(err);
                setError('Listing not found');
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <p className="text-gray-500">{error || 'Listing not found'}</p>
                <Link to="/" className="text-sm text-black underline mt-4 inline-block">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image */}
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    {listing.images?.[0] ? (
                        <img
                            src={listing.images[0].image_url}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No image
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <span className={`inline-block px-3 py-1 text-xs tracking-[0.2em] uppercase mb-4 ${
                        listing.section === 'thrift' ? 'bg-gray-100 text-black' : 'bg-black text-white'
                    }`}>
                        {listing.section}
                    </span>

                    <h1 className="text-3xl font-light tracking-[0.05em] mb-2">{listing.title}</h1>
                    <p className="text-2xl font-light mb-6">NPR {listing.price}</p>

                    {listing.description && (
                        <p className="text-gray-600 leading-relaxed mb-6">{listing.description}</p>
                    )}

                    <div className="space-y-2 text-sm text-gray-500 mb-8">
                        {listing.condition && (
                            <p>Condition: <span className="capitalize text-black">{listing.condition.replace('_', ' ')}</span></p>
                        )}
                        {listing.size && (
                            <p>Size: <span className="capitalize text-black">{listing.size.replace('_', ' ')}</span></p>
                        )}
                        <p>Category: <span className="capitalize text-black">{listing.category.replace('_', ' ')}</span></p>
                        <p>Status: <span className="capitalize text-black">{listing.status}</span></p>
                    </div>

                    {listing.status === 'active' ? (
                        <button
                            className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
                        >
                            Buy Now
                        </button>
                    ) : (
                        <p className="text-sm text-gray-400 uppercase tracking-wider">
                            {listing.status === 'sold' ? 'Sold Out' : 'Not Available'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;