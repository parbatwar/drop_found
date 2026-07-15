// src/pages/seller/SellerShop.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMySellerProfile } from '../../api/seller';

function SellerShop() {
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadSeller = async () => {
            try {
                const res = await getMySellerProfile();
                setSeller(res.data);
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    'Unable to load your shop profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadSeller();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 animate-pulse">
                    Loading Shop...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-6">
                <div className="border border-neutral-200 p-6 max-w-md w-full text-center">
                    <p className="text-sm text-neutral-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-6 mb-10">
                    <div>
                        <span className="block text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-2">
                            Seller Shop
                        </span>

                        <h1 className="text-3xl uppercase tracking-[0.08em] font-light">
                            My Shop
                        </h1>
                    </div>

                    <Link
                        to="/seller/shop/edit"
                        className="border border-black px-5 py-2 text-[11px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition"
                    >
                        Edit Shop
                    </Link>
                </div>

                {/* Shop Info */}
                <div className="bg-white border border-neutral-200 p-8">

                    <div className="flex flex-col sm:flex-row gap-8">

                        {/* Logo */}
                        <div className="flex-shrink-0">
                            {seller.avatar_url ? (
                                <img
                                    src={seller.avatar_url}
                                    alt={seller.shop_name}
                                    className="w-32 h-32 rounded-full object-cover border border-neutral-200"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border border-neutral-200 bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs uppercase tracking-widest">
                                    No Logo
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-5">

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-1">
                                    Shop Name
                                </p>

                                <h2 className="text-2xl font-light uppercase tracking-wide">
                                    {seller.shop_name}
                                </h2>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-1">
                                    Verification
                                </p>

                                <span className="inline-block px-3 py-1 bg-neutral-100 text-xs uppercase tracking-widest rounded">
                                    {seller.verification_status}
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-1">
                                    Seller Type
                                </p>

                                <p className="capitalize text-neutral-700">
                                    {seller.seller_type}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-1">
                                    Location
                                </p>

                                <p className="text-neutral-700">
                                    {seller.location || 'Not specified'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-1">
                                    Bio
                                </p>

                                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {seller.bio || 'No shop bio yet.'}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SellerShop;