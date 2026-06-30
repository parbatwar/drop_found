// src/pages/seller/Listings.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListings, deleteListing } from '../../api/listings';
import { getMySellerProfile } from '../../api/seller';

function Listings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get the logged-in seller's profile to know their seller_id
                const sellerRes = await getMySellerProfile();
                const sellerId = sellerRes.data.id;

                // fetch all listings, then filter to only this seller's
                const listingsRes = await getListings();
                const myListings = listingsRes.data.filter(
                    (item) => item.seller_id === sellerId
                );

                setListings(myListings);
            } catch (err) {
                console.error(err);
                setError('Failed to load your listings');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this listing? This cannot be undone.')) return;
        try {
            await deleteListing(id);
            setListings(listings.filter((l) => l.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete listing');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return <p className="max-w-5xl mx-auto px-4 py-12 text-sm text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-light tracking-[0.1em]">My Listings</h1>
                <Link
                    to="/seller/listings/new"
                    className="bg-black text-white px-6 py-2.5 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                >
                    + New Listing
                </Link>
            </div>

            {listings.length === 0 ? (
                <p className="text-sm text-gray-400">You haven't created any listings yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {listings.map((item) => (
                        <div key={item.id} className="border border-gray-100 p-4">
                            {item.images?.[0] ? (
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                                    <img
                                        src={item.images[0].image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[3/4] bg-gray-100 mb-3" />
                            )}
                            <h3 className="text-sm font-medium">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">NPR {item.price}</p>
                            <p className="text-xs text-gray-400 mt-1 capitalize">
                                Status: {item.status}
                            </p>
                            <div className="flex gap-3 mt-4">
                                <Link
                                    to={`/seller/listings/${item.id}/edit`}
                                    className="text-xs text-gray-500 hover:text-black underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Listings;