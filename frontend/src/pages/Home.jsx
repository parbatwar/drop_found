// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {

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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { name: 'Kathmandu Thrift Co.', items: 124, verified: true },
                            { name: 'Patan Vintage House', items: 87, verified: true },
                            { name: 'Thamel Surplus', items: 56, verified: false },
                            { name: 'Lalitpur Wardrobe', items: 102, verified: true },
                            { name: 'Boudha Basics', items: 73, verified: false },
                        ].map((shop, index) => (
                            <Link key={index} to={`/shop/${shop.name.toLowerCase().replace(/\s/g, '-')}`} className="group">
                                <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                                    <img
                                        src={`https://images.unsplash.com/photo-${[1523381210434, 1539008835657, 1490481651875, 1529139572806, 1523381210434][index]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                                        alt={shop.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-sm font-light">{shop.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {shop.verified && <span className="text-gray-400">✓</span>}
                                    <span>{shop.items} items</span>
                                </div>
                            </Link>
                        ))}
                    </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Vintage Levi\'s 501 Denim Jacket', shop: 'Kathmandu Thrift Co.', price: 'NPR 3,200', tag: 'Thrift' },
                            { name: 'Cream Wool Crewneck Knit', shop: 'Patan Vintage House', price: 'NPR 1,800', tag: 'Thrift' },
                            { name: 'Black Leather Lace-Up Boots', shop: 'Thamel Surplus', price: 'NPR 4,500', tag: 'Surplus' },
                            { name: 'Plaid Cotton Flannel Overshirt', shop: 'Lalitpur Wardrobe', price: 'NPR 1,200', tag: 'Thrift' },
                            { name: 'Washed Cotton Crew Tee', shop: 'Boudha Basics', price: 'NPR 650', tag: 'Thrift' },
                            { name: 'Brown Corduroy Trousers', shop: 'Kathmandu Thrift Co.', price: 'NPR 1,450', tag: 'Thrift' },
                            { name: 'Indigo Selvedge Denim Jacket', shop: 'Patan Vintage House', price: 'NPR 2,800', tag: 'Surplus' },
                            { name: 'Off-White Cable Knit Sweater', shop: 'Boudha Basics', price: 'NPR 1,950', tag: 'Thrift' },
                        ].map((item, index) => (
                            <Link key={index} to={`/product/${item.name.toLowerCase().replace(/\s/g, '-')}`} className="group">
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative">
                                    <img
                                        src={`https://images.unsplash.com/photo-${[1539008835657, 1490481651875, 1523381210434, 1539008835657, 1490481651875, 1523381210434, 1539008835657, 1490481651875][index]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs tracking-[0.2em] uppercase ${
                                        item.tag === 'Thrift' ? 'bg-white text-black' : 'bg-black text-white'
                                    }`}>
                                        {item.tag}
                                    </span>
                                </div>
                                <h3 className="text-sm font-light">{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{item.shop}</p>
                                <p className="text-sm font-light mt-1">{item.price}</p>
                            </Link>
                        ))}
                    </div>
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