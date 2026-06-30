// src/pages/SellerProfile.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getSellerBySlug } from '../../api/seller';
import { getSellerListings } from '../../api/listings';

function SellerProfile() {
    const { slug } = useParams();

    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellerRes = await getSellerBySlug(slug);

                setSeller(sellerRes.data);

                const listingsRes = await getSellerListings(
                    sellerRes.data.id
                );

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

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                Loading...
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">
                    {error}
                </p>

                <Link
                    to="/"
                    className="text-black underline mt-4 inline-block"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Seller Header */}
            <div className="border-b border-gray-200 pb-8 mb-8">

                {seller.avatar_url && (
                    <img
                        src={seller.avatar_url}
                        alt={seller.shop_name}
                        className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                )}

                <h1 className="text-4xl font-light tracking-[0.05em]">
                    {seller.shop_name}
                </h1>

                {seller.bio && (
                    <p className="text-gray-600 mt-3 max-w-2xl">
                        {seller.bio}
                    </p>
                )}

                <div className="flex gap-4 mt-4 text-sm text-gray-500">

                    <span className="capitalize">
                        {seller.seller_type}
                    </span>

                    {seller.location && (
                        <span>
                            📍 {seller.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Listings */}
            <div>

                <h2 className="text-xl font-light tracking-[0.1em] mb-6">
                    Items from this shop
                </h2>

                {listings.length === 0 ? (
                    <div className="bg-gray-50 p-8 text-center text-sm text-gray-500">
                        No items listed yet
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        {listings.map((item) => (
                            <Link
                                key={item.id}
                                to={`/product/${item.id}`}
                                className="group"
                            >
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3">

                                    {item.images?.[0] ? (
                                        <img
                                            src={item.images[0].image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}

                                </div>

                                <h3 className="text-sm">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    NPR {item.price}
                                </p>
                            </Link>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default SellerProfile;