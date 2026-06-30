// src/pages/SellerProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSellerBySlug } from '../../api/seller';

function SellerProfile() {
    const { slug } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Simple useEffect with slug dependency
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const response = await getSellerBySlug(slug);
                setSeller(response.data);
            } catch (err) {
                setError('Seller not found');
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
                <Link to="/" className="text-black underline mt-4 inline-block">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="border-b border-gray-200 pb-8 mb-8">
                <h1 className="text-4xl font-light tracking-[0.05em]">
                    {seller.shop_name}
                </h1>
                {seller.shop_description && (
                    <p className="text-gray-600 mt-2 max-w-2xl">
                        {seller.shop_description}
                    </p>
                )}
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    {seller.shop_address && <span>📍 {seller.shop_address}</span>}
                    {seller.contact_number && <span>📞 {seller.contact_number}</span>}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-light tracking-[0.1em] mb-4">
                    Items from this shop
                </h2>
                <div className="text-gray-500 text-sm bg-gray-50 p-8 text-center">
                    No items listed yet
                </div>
            </div>
        </div>
    );
}

export default SellerProfile;