// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getListings } from '../api/listings';
import { getSellers, getMySellerProfile } from '../api/seller';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sellerStatus, setSellerStatus] = useState(null);
    const [statusLoading, setStatusLoading] = useState(true);

    // Fetch homepage data
    useEffect(() => {
        Promise.all([getListings(), getSellers()])
            .then(([listingsRes, sellersRes]) => {
                setListings(listingsRes?.data || []);
                setSellers(sellersRes?.data || []);
            })
            .catch((err) => console.error('Failed to load homepage data:', err))
            .finally(() => setLoading(false));
    }, []);

    // Check seller application status
    useEffect(() => {
        const checkSellerStatus = async () => {
            if (!user) {
                setStatusLoading(false);
                return;
            }

            try {
                const response = await getMySellerProfile();
                const status = response.data?.verification_status;
                setSellerStatus(status);
            } catch (error) {
                if (error.response?.status === 404) {
                    setSellerStatus(null);
                } else {
                    console.error('Failed to fetch seller status:', error);
                }
            } finally {
                setStatusLoading(false);
            }
        };

        checkSellerStatus();
    }, [user]);

    // Get seller section content based on status
    const getSellerSectionContent = () => {
        if (statusLoading) {
            return {
                label: 'Partnership',
                title: 'Become a Curator',
                description: 'Open your shop on Drop Found. List your pre-loved inventory, set your own rates, and reach intentional buyers across Nepal without initial listing fees.',
                buttonText: 'Loading...',
                buttonLink: '#',
                buttonDisabled: true,
                buttonClass: 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            };
        }

        if (sellerStatus === 'pending') {
            return {
                label: 'Application Status',
                title: 'Application Under Review',
                description: 'Your application is currently being reviewed by our team. We\'ll notify you once approved. This usually takes 2-3 business days.',
                buttonText: '⏳ Under Review',
                buttonLink: '#',
                buttonDisabled: true,
                buttonClass: 'bg-neutral-200 text-neutral-600 cursor-not-allowed relative'
            };
        }

        if (sellerStatus === 'approved') {
            return {
                label: 'Welcome Seller',
                title: 'You\'re a Seller!',
                description: 'Your shop is live on Drop Found. Start managing your listings, orders, and sales from your seller dashboard.',
                buttonText: 'Go to Dashboard',
                buttonLink: '/seller/dashboard',
                buttonDisabled: false,
                buttonClass: 'bg-black text-white hover:bg-neutral-800'
            };
        }

        if (sellerStatus === 'rejected') {
            return {
                label: 'Reapplication',
                title: 'Reapply to Sell',
                description: 'Your previous application was not approved. Please review your shop details and reapply with updated information. We\'re here to help you get started.',
                buttonText: 'Reapply Now',
                buttonLink: '/seller/apply',
                buttonDisabled: false,
                buttonClass: 'bg-black text-white hover:bg-neutral-800'
            };
        }

        // No application
        return {
            label: 'Partnership',
            title: 'Become a Curator',
            description: 'Open your shop on Drop Found. List your pre-loved inventory, set your own rates, and reach intentional buyers across Nepal without initial listing fees.',
            buttonText: 'Apply To Sell',
            buttonLink: '/apply',
            buttonDisabled: false,
            buttonClass: 'bg-black text-white hover:bg-neutral-800'
        };
    };

    const sectionContent = getSellerSectionContent();

    // Clean loading skeleton component to keep the minimalist vibe
    const SkeletonCard = ({ aspect = 'aspect-square' }) => (
        <div className="animate-pulse space-y-3">
            <div className={`${aspect} bg-neutral-100 rounded-sm`} />
            <div className="h-3 bg-neutral-100 rounded w-2/3" />
            <div className="h-3 bg-neutral-100 rounded w-1/3" />
        </div>
    );

    return (
        <div className="bg-white min-h-screen text-neutral-900">
            {/* Hero Section */}
            <section className="py-16 md:py-24 border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Hero Copy */}
                        <div className="lg:col-span-5 space-y-6">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                                SS 26 — New Drops Weekly
                            </span>
                            <h1 className="text-4xl md:text-5xl font-light tracking-[0.08em] leading-[1.15] text-black">
                                FIND IT.<br />WEAR IT.
                            </h1>
                            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                                Nepal's online thrift and surplus marketplace. Hand-picked pieces 
                                from independent sellers in Kathmandu, Patan, and beyond.
                            </p>
                            
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    to="/thrift"
                                    className="bg-black text-white px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                                >
                                    Shop Thrift
                                </Link>
                                <Link
                                    to="/surplus"
                                    className="border border-neutral-200 px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                                >
                                    Shop Surplus
                                </Link>
                            </div>
                            
                            {/* Analytics Strip */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-100">
                                <div>
                                    <p className="text-xl font-light tracking-tight">50+</p>
                                    <p className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">Thrift Shops</p>
                                </div>
                                <div>
                                    <p className="text-xl font-light tracking-tight">20+</p>
                                    <p className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">Surplus Hubs</p>
                                </div>
                                <div>
                                    <p className="text-xl font-light tracking-tight">1.2K+</p>
                                    <p className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">Live Items</p>
                                </div>
                            </div>
                        </div>
                        

                        {/* Hero Image Context */}
                        <div className="lg:col-span-7 pl-0 lg:pl-8">
                            <div className="aspect-[16/10] overflow-hidden bg-neutral-50 border border-neutral-100 rounded-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="High-fidelity minimalist premium editorial campaign portrait"
                                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Featured Shops */}
            <section className="py-16 border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-1">Curated Spaces</span>
                        <h2 className="text-xl font-light tracking-[0.15em] uppercase text-black">Verified Shops</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, i) => <SkeletonCard key={i} aspect="aspect-square" />)}
                        </div>
                    ) : sellers.length === 0 ? (
                        <p className="text-xs tracking-wider text-neutral-400 py-4">No verified shops listed at the moment.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {sellers.slice(0, 5).map((shop) => (
                                <Link key={shop.id} to={`/shop/${shop.slug}`} className="group block">
                                    <div className="aspect-square bg-neutral-50 border border-neutral-100 overflow-hidden mb-3 relative">
                                        {shop.avatar_url ? (
                                            <img
                                                src={shop.avatar_url}
                                                alt={shop.shop_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform cubic-bezier(0.4, 0, 0.2, 1) duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-300 text-xs tracking-widest uppercase">
                                                {shop.shop_name?.slice(0,2)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xs uppercase tracking-wider text-neutral-800 group-hover:text-black transition-colors">{shop.shop_name}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">
                                        <span className="text-neutral-300">/</span>
                                        <span>{shop.seller_type || 'Curator'}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* This Week - New Drops */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-1">Latest Arrivals</span>
                            <h2 className="text-xl font-light tracking-[0.15em] uppercase text-black">New Drops</h2>
                        </div>
                        <Link to="/all" className="text-xs text-neutral-400 hover:text-black transition-colors tracking-widest uppercase border-b border-transparent hover:border-black pb-0.5">
                            Browse All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <SkeletonCard key={i} aspect="aspect-[3/4]" />)}
                        </div>
                    ) : listings.length === 0 ? (
                        <p className="text-xs tracking-wider text-neutral-400 py-4">No drops found this week.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listings.slice(0, 8).map((item) => (
                                <Link key={item.id} to={`/product/${item.id}`} className="group block">
                                    <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 overflow-hidden mb-3 relative">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0].image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform cubic-bezier(0.4, 0, 0.2, 1) duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100" />
                                        )}
                                        {item.section && (
                                            <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase font-medium shadow-sm bg-white text-black border border-neutral-100">
                                                {item.section}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xs tracking-wide text-neutral-600 truncate group-hover:text-black transition-colors">{item.title}</h3>
                                    <p className="text-xs font-medium text-neutral-900 mt-1">NPR {Number(item.price).toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* For Sellers B2B CTA - Dynamic based on status */}
            <section className="bg-neutral-50 py-20 border-t border-neutral-100">
                <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 block">
                        {sectionContent.label}
                    </span>
                    <h2 className="text-2xl font-light tracking-[0.1em] text-black uppercase">
                        {sectionContent.title}
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        {sectionContent.description}
                    </p>
                    <div className="pt-2">
                        {sectionContent.buttonDisabled ? (
                            <button
                                className={`inline-block px-9 py-3 text-xs tracking-[0.2em] uppercase ${sectionContent.buttonClass}`}
                                disabled
                            >
                                {sectionContent.buttonText}
                            </button>
                        ) : (
                            <Link
                                to={sectionContent.buttonLink}
                                className={`inline-block px-9 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${sectionContent.buttonClass}`}
                            >
                                {sectionContent.buttonText}
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;