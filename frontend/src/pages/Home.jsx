// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getListings } from '../api/listings';
import { getSellers, getMySellerProfile } from '../api/seller';
import { useAuth } from '../context/AuthContext';
import ListingGrid from '../components/listings/ListingGrid';
import ListingCard from '../components/listings/ListingCard';

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
                setListings(listingsRes?.data?.items || []);
                setSellers(sellersRes?.data?.items || []);
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
            title: 'Become a Seller',
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
            <section className="relative w-full h-[88vh] min-h-[520px] max-h-[820px] bg-neutral-900 overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster="https://images.pexels.com/photos/6070170/pexels-photo-6070170.jpeg"
            >
                <source 
                src="https://www.pexels.com/download/video/8306456/" 
                type="video/mp4" 
                />
                {/* Fallback: Your browser does not support the video tag. */}
            </video>

            {/* Fallback Image (shows if video fails) */}
            <img
                src="https://images.pexels.com/photos/6070170/pexels-photo-6070170.jpeg"
                alt="Drop Found — Nepal's Clothing Marketplace"
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 hidden"
            />

            {/* Overlay — stronger on the left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12">
                <div className="max-w-xl">
                    {/* Label */}
                    <p className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.22em] uppercase text-white/55 font-medium mb-5">
                    <span className="w-8 h-px bg-red-600" />
                    Nepal's Clothing Marketplace
                    </p>

                    {/* Heading */}
                    <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold tracking-tight leading-[1.08] text-white">
                    Discover
                    <br />
                    <span className="text-red-500">Pre-loved &amp; New</span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 text-[15px] sm:text-base text-white/65 max-w-md leading-relaxed">
                    Shop curated thrift finds and brand-new fashion from verified sellers across Nepal. Every piece tells a story.
                    </p>

                    {/* CTAs */}
                    <div className="mt-9 flex flex-wrap items-center gap-3.5">
                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 h-12 px-7 bg-white text-neutral-900 text-[12px] font-semibold tracking-[0.14em] uppercase rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                        Start Shopping
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>

                    <Link
                        to="/sell"
                        className="inline-flex items-center gap-2 h-12 px-7 border border-white/35 text-white text-[12px] font-semibold tracking-[0.14em] uppercase rounded-full hover:bg-white/10 hover:border-white/55 hover:text-white/90 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
                    >
                        Become a Seller
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                    </div>

                    {/* Trust row */}
                    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[11px] tracking-[0.12em] uppercase text-white/45">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Verified Sellers
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Secure Checkout
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Nepal-Wide Shipping
                    </span>
                    </div>
                </div>
                </div>
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
                        <ListingGrid.Loading count={8} />
                    ) : listings.length === 0 ? (
                        <p className="text-xs tracking-wider text-neutral-400 py-4">No drops found this week.</p>
                    ) : (
                        <ListingGrid>
                            {listings.slice(0, 8).map((item) => (
                                <ListingCard key={item.id} listing={item} />
                            ))}
                        </ListingGrid>
                    )}
                </div>
            </section>

{/* Featured Shop — Editorial Campaign Banner */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 aspect-[16/7] sm:aspect-[16/6] md:aspect-[21/8] shadow-xl">
                        {/* Background Image with Zoom Effect */}
                        <img 
                            src="https://images.pexels.com/photos/15722837/pexels-photo-15722837.jpeg"
                            alt="Curated Collection"
                            className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        
                        {/* Gradient Overlays for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                        {/* Content Box */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
                            <div className="max-w-xl">
                                <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-white/70 font-medium mb-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                    Editor's Pick
                                </span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide uppercase text-white leading-tight">
                                    The Sustainable Archive
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-white/70 font-light tracking-wide line-clamp-2 max-w-md">
                                    Explore hand-picked vintage layers and archival streetwear curated exclusively by our top-rated creators.
                                </p>
                                
                                <div className="mt-5">
                                    <Link 
                                        to="/browse" 
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-neutral-100 transition-all duration-300 shadow-md group/btn"
                                    >
                                        <span>Explore Collection</span>
                                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Shops*/}
            <section className="py-16 border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-1">Explore shops</span>
                        <h2 className="text-xl font-light tracking-[0.15em] uppercase text-black">Shops</h2>
                    </div>
                    <Link to="/all" className="text-xs text-neutral-400 hover:text-black transition-colors tracking-widest uppercase border-b border-transparent hover:border-black pb-0.5">
                        Browse All
                    </Link>
                </div>

                {loading ? (
                <div className="flex gap-8 overflow-x-auto pb-4">
                    {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-28 animate-pulse">
                        <div className="aspect-square bg-neutral-100 rounded-full mb-3" />
                        <div className="h-3.5 bg-neutral-100 rounded w-20 mx-auto" />
                        <div className="h-2.5 bg-neutral-100 rounded w-14 mx-auto mt-1" />
                    </div>
                    ))}
                </div>
                ) : sellers.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-12">No verified shops yet</p>
                ) : (
                <div className="flex gap-8 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    {sellers.slice(0, 10).map((shop) => (
                    <Link
                        key={shop.id}
                        to={`/shop/${shop.slug}`}
                        className="flex-shrink-0 flex flex-col items-center group w-28"
                    >
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-neutral-100 border-2 border-neutral-200 overflow-hidden group-hover:border-neutral-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        {shop.avatar_url ? (
                            <img
                            src={shop.avatar_url}
                            alt={shop.shop_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg font-light tracking-wider uppercase">
                            {shop.shop_name?.slice(0, 2)}
                            </div>
                        )}
                        </div>
                        
                        {/* Name */}
                        <p className="mt-3 text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors truncate max-w-[100px]">
                        {shop.shop_name}
                        </p>
                        
                        {/* Seller Type */}
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                        {shop.seller_type || 'Curator'}
                        </p>
                    </Link>
                    ))}
                </div>
                )}
            </div>
            </section>

            {/* For Sellers */}
            <section className="py-0 overflow-hidden">
                <div className="w-full bg-neutral-900 relative">
                    {/* Subtle decorative background detail */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
                            
                            {/* Left: Content */}
                            <div className="text-center lg:text-left max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 font-medium">
                                        {sectionContent.label}
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white leading-snug">
                                    {sectionContent.title}
                                </h2>
                                <p className="mt-3 text-sm sm:text-base text-white/50 font-light leading-relaxed max-w-xl">
                                    {sectionContent.description}
                                </p>
                            </div>
                            
                            {/* Right: Modern Action Button */}
                            <div className="flex-shrink-0 flex justify-center lg:justify-end">
                                {sectionContent.buttonDisabled ? (
                                    <button
                                        className={`inline-flex items-center justify-center px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-medium rounded-full bg-white/10 text-white/40 cursor-not-allowed border border-white/5 ${sectionContent.buttonClass}`}
                                        disabled
                                    >
                                        {sectionContent.buttonText}
                                    </button>
                                ) : (
                                    <Link
                                        to={sectionContent.buttonLink}
                                        className="group relative inline-flex items-center justify-center px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-medium rounded-full bg-white text-neutral-900 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-white/5 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {sectionContent.buttonText}
                                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </Link>
                                )}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;