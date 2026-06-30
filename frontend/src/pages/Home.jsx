// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect  } from 'react';

import { getListings } from '../api/listings';
import { getSellers } from '../api/seller';

function Home() {
    const [listings, setListings] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getListings(), getSellers()])
            .then(([listingsRes, sellersRes]) => {
                setListings(listingsRes.data);
                setSellers(sellersRes.data);
            })
            .catch((err) => console.error('Failed to load homepage data:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-gray-50 py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
                                SS 25 — New Drops Weekly
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] mt-4 mb-6 leading-tight">
                                FIND IT.<br />WEAR IT.
                            </h1>
                            <p className="text-gray-600 leading-relaxed max-w-md mb-8">
                                Nepal's online thrift and surplus marketplace. Hand-picked pieces 
                                from independent sellers in Kathmandu, Patan, and beyond.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/thrift"
                                    className="bg-black text-white px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors duration-300"
                                >
                                    Shop Thrift
                                </Link>
                                <Link
                                    to="/surplus"
                                    className="border border-black px-8 py-3 text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                                >
                                    Shop Surplus
                                </Link>
                            </div>
                            
                            <div className="flex gap-8 mt-8 pt-8 border-t border-gray-200">
                                <div>
                                    <p className="text-2xl font-light">50+</p>
                                    <p className="text-xs text-gray-500 tracking-wide">Thrift Sellers</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-light">20+</p>
                                    <p className="text-xs text-gray-500 tracking-wide">Surplus Sellers</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-light">1.2K+</p>
                                    <p className="text-xs text-gray-500 tracking-wide">Items Available</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                                <img
                                    src="https://images.unsplash.com/photo-1490481651875-aed2d4d73b2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Editorial"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white p-4 shadow-lg">
                                <span className="text-xs tracking-[0.2em] uppercase">Editorial campaign</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Surplus Coming Soon */}
            <section className="py-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-light tracking-[0.15em] mt-2 mb-4">
                            Surplus — Coming Soon.
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Join the waitlist for premium surplus drops
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Shops */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">Featured</span>
                            <h2 className="text-2xl font-light tracking-[0.15em]">Shops</h2>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : sellers.length === 0 ? (
                        <p className="text-sm text-gray-400">No shops yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {sellers.slice(0, 5).map((shop) => (
                                <Link key={shop.id} to={`/shop/${shop.slug}`} className="group">
                                    <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                                        {shop.avatar_url ? (
                                            <img
                                                src={shop.avatar_url}
                                                alt={shop.shop_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                    </div>
                                    <h3 className="text-sm font-light">{shop.shop_name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="text-gray-400">✓</span>
                                        <span className="capitalize">{shop.seller_type}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* This Week - New Drops */}
            <section className="py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">This Week</span>
                            <h2 className="text-2xl font-light tracking-[0.15em]">New Drops</h2>
                        </div>
                        <Link to="/all" className="text-sm text-gray-500 hover:text-black transition-colors tracking-wider uppercase">
                            Browse All
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : listings.length === 0 ? (
                        <p className="text-sm text-gray-400">No listings yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listings.slice(0, 8).map((item) => (
                                <Link key={item.id} to={`/product/${item.id}`} className="group">
                                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0].image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200" />
                                        )}
                                        <span className={`absolute top-3 left-3 px-3 py-1 text-xs tracking-[0.2em] uppercase ${
                                            item.section === 'thrift' ? 'bg-white text-black' : 'bg-black text-white'
                                        }`}>
                                            {item.section}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-light">{item.title}</h3>
                                    <p className="text-sm font-light mt-1">NPR {item.price}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* For Sellers CTA */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-light tracking-[0.1em] mb-4">
                        For Sellers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Open your shop on Drop Found. List your pre-loved inventory, set your own prices,
                        and reach buyers across Nepal. No listing fees.
                    </p>
                    <Link
                        to="/apply"
                        className="inline-block bg-black text-white px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors duration-300"
                    >
                        Apply To Sell
                    </Link>
                </div>
            </section>
        </>
    );
}

export default Home;