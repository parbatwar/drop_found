// src/pages/SellerDashboard.jsx
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getMySellerProfile } from '../../api/seller';

function SellerDashboard() {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const successMessage = location.state?.message;

    // ✅ Simple useEffect - fetch seller data
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const response = await getMySellerProfile();
                setSeller(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('You are not a seller yet');
                } else {
                    setError('Failed to load seller profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-light mb-4">Not a Seller Yet</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link
                    to="/apply"
                    className="inline-block bg-black text-white px-8 py-3 text-sm tracking-[0.2em] uppercase"
                >
                    Apply Now
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6">
                    {successMessage}
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-light tracking-[0.1em]">
                    Seller Dashboard
                </h1>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1">
                    {seller.status || 'Active'}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6">
                    <h3 className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-3">
                        Shop Information
                    </h3>
                    <p className="text-xl font-light">{seller.shop_name}</p>
                    {seller.shop_description && (
                        <p className="text-gray-600 text-sm mt-2">{seller.shop_description}</p>
                    )}
                    {seller.shop_address && (
                        <p className="text-gray-500 text-sm mt-2">📍 {seller.shop_address}</p>
                    )}
                    {seller.contact_number && (
                        <p className="text-gray-500 text-sm mt-1">📞 {seller.contact_number}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">Slug: {seller.slug}</p>
                </div>

                <div className="border border-gray-200 p-6">
                    <h3 className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-3">
                        Quick Actions
                    </h3>
                    <div className="flex flex-col gap-3">
                        <Link
                            to={`/seller/${seller.slug}`}
                            className="bg-black text-white px-6 py-2 text-sm text-center hover:bg-gray-800"
                        >
                            View Shop
                        </Link>
                        <Link
                            to="/items/new"
                            className="border border-black px-6 py-2 text-sm text-center hover:bg-black hover:text-white"
                        >
                            Add New Item
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboard;