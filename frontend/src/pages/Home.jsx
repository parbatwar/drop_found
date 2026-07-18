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

            {/* Hero Section - Full Width Premium Editorial */}
            <section className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                    
                    {/* Thrift Half */}
                    <Link 
                        to="/thrift" 
                        className="group relative overflow-hidden h-[85vh] md:h-[95vh] bg-neutral-100"
                    >
                        <img 
                            src="https://images.pexels.com/photos/6070170/pexels-photo-6070170.jpeg?_gl=1*143wv0j*_ga*ODI3MDMzMTU5LjE3ODQxMzAyODg.*_ga_8JE65Q40S6*czE3ODQxMzAyODckbzEkZzEkdDE3ODQxMzAzMzYkajExJGwwJGgw"
                            alt="Thrift Collection"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-colors duration-700" />
                        
                        {/* Left Bottom Text Placement */}
                        <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white max-w-sm">
                            <span className="text-[10px] tracking-[0.3em] uppercase font-light opacity-70 block mb-3">
                                Collection
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] uppercase">
                                Thrift
                            </h2>
                            <div className="w-10 h-px bg-white/40 mt-3 mb-3" />
                            <p className="text-sm font-light leading-relaxed opacity-80 max-w-xs">
                                Pre-loved vintage & modern pieces. Each item tells a story.
                            </p>
                            <span className="inline-block mt-5 text-[11px] tracking-[0.25em] uppercase text-white/80 hover:text-white transition-colors duration-300 border-b border-white/30 hover:border-white pb-0.5">
                                Explore Thrift →
                            </span>
                        </div>
                    </Link>

                    {/* Brand New Half */}
                    <Link 
                        to="/brand-new" 
                        className="group relative overflow-hidden h-[85vh] md:h-[95vh] bg-neutral-100"
                    >
                        <img 
                            src="https://images.pexels.com/photos/15722837/pexels-photo-15722837.jpeg?_gl=1*jzdztu*_ga*ODI3MDMzMTU5LjE3ODQxMzAyODg.*_ga_8JE65Q40S6*czE3ODQxMzAyODckbzEkZzEkdDE3ODQxMzA1MDckajEwJGwwJGgw"
                            alt="Brand New Collection"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-colors duration-700" />
                        
                        {/* Left Bottom Text Placement */}
                        <div className="absolute bottom-12 left-8 md:bottom-16 md:left-12 text-white max-w-sm">
                            <span className="text-[10px] tracking-[0.3em] uppercase font-light opacity-70 block mb-3">
                                Collection
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] uppercase">
                                Brand New
                            </h2>
                            <div className="w-10 h-px bg-white/40 mt-3 mb-3" />
                            <p className="text-sm font-light leading-relaxed opacity-80 max-w-xs">
                                Shop authentic brand new clothing from trusted brands and verified sellers.
                            </p>
                            <span className="inline-block mt-5 text-[11px] tracking-[0.25em] uppercase text-white/80 hover:text-white transition-colors duration-300 border-b border-white/30 hover:border-white pb-0.5">
                                Explore Brand New →
                            </span>
                        </div>
                    </Link>

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