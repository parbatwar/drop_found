// pages/seller/SellerDashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMySellerProfile } from '../../api/seller';
import { getSellerListings } from '../../api/listings';
import { getSellerOrders } from '../../api/orders';
import { Icons } from '../../components/Icons';
import FollowersModal from '../../components/FollowersModal'; // ✅ Import the modal

function SellerDashboard() {
    const { user } = useAuth();
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFollowersModal, setShowFollowersModal] = useState(false); // ✅ Add state
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeListings: 0,
        totalOrders: 0,
        itemsSold: 0,
        totalViews: 0,
        followers: 0,
        rating: 0,
        reviews: 0
    });

    useEffect(() => {
        const loadSellerData = async () => {
            try {
                // Get seller profile
                const sellerRes = await getMySellerProfile();
                const sellerData = sellerRes.data;
                setSeller(sellerData);

                // Get seller listings
                const listingsRes = await getSellerListings(sellerData.id);
                const listingsData = listingsRes.data || [];
                setListings(listingsData);

                // Get seller orders
                let ordersData = [];
                let itemsSold = 0;
                try {
                    const ordersRes = await getSellerOrders();
                    ordersData = ordersRes.data || [];
                    
                    // Calculate items sold from delivered orders
                    const deliveredOrders = ordersData.filter(o => o.status === 'delivered');
                    itemsSold = deliveredOrders.reduce((total, order) => {
                        const orderItems = order.items || [];
                        const orderTotal = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                        return total + orderTotal;
                    }, 0);
                } catch (err) {
                    console.error('Failed to fetch orders:', err);
                }

                // Calculate stats
                const active = listingsData.filter(
                    item => item.status === 'active' || item.status === 'published'
                ).length;
                const total = listingsData.length;
                const pendingOrders = ordersData.filter(o => o.status === 'pending').length;

                setStats({
                    totalProducts: total,
                    activeListings: active,
                    totalOrders: pendingOrders,
                    itemsSold: itemsSold,
                    followers: sellerData.followers_count || 0,
                    rating: sellerData.average_rating || 0,
                    reviews: sellerData.total_reviews || 0
                });
            } catch (error) {
                console.error('Failed to load seller data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSellerData();
    }, []);

    // Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={`text-sm ${i <= roundedRating ? 'text-amber-500' : 'text-neutral-200'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const actionItems = [
        { id: 1, name: 'Add Product', path: '/seller/listings/new', icon: Icons.Plus },
        { id: 2, name: 'Manage Products', path: '/seller/listings', icon: Icons.Grid },
        { id: 3, name: 'View Orders', path: '/seller/orders', icon: Icons.Package },
    ];

    const futureActions = [
        { id: 4, name: 'Analytics', icon: Icons.Store },
        { id: 5, name: 'Promotions', icon: Icons.Store },
        { id: 6, name: 'Sales', icon: Icons.Store },
        { id: 7, name: 'Settings', icon: Icons.Store },
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-6 bg-neutral-100 rounded w-1/4" />
                    <div className="h-4 bg-neutral-100 rounded w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="h-96 bg-neutral-100" />
                        <div className="md:col-span-2 space-y-6">
                            <div className="h-20 bg-neutral-100" />
                            <div className="h-20 bg-neutral-100" />
                            <div className="h-20 bg-neutral-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">

                {/* Main Content - 1/3 + 2/3 Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Shop Profile (1/3) */}
                    <div className="md:col-span-1">
                        <div className="border border-neutral-200 p-6 md:p-8 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                    Shop Profile
                                </h2>
                                <Link
                                    to="/seller/shop/edit"
                                    className="text-neutral-400 hover:text-black transition-colors"
                                >
                                    <Icons.Edit />
                                </Link>
                            </div>

                            {seller && (
                                <div className="space-y-5">
                                    {/* Logo */}
                                    <div className="flex justify-center">
                                        {seller.avatar_url ? (
                                            <img
                                                src={seller.avatar_url}
                                                alt={seller.shop_name}
                                                className="w-24 h-24 rounded-full object-cover border border-neutral-200"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-300 text-[10px] uppercase tracking-widest">
                                                No Logo
                                            </div>
                                        )}
                                    </div>

                                    {/* Shop Name */}
                                    <div className="text-center">
                                        <h3 className="text-lg font-light">
                                            {seller.shop_name}
                                        </h3>
                                        <span className={`inline-block mt-1 text-[10px] uppercase tracking-widest ${
                                            seller.verification_status === 'approved' ? 'text-green-600' :
                                            seller.verification_status === 'pending' ? 'text-yellow-600' :
                                            seller.verification_status === 'rejected' ? 'text-red-600' :
                                            'text-neutral-400'
                                        }`}>
                                            {seller.verification_status || 'Pending'}
                                        </span>
                                    </div>

                                    {/* Stats Row - Followers, Rating, Reviews */}
                                    <div className="border-t border-neutral-100 pt-4">
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            {/* ✅ Followers - Made clickable */}
                                            <div>
                                                <button
                                                    onClick={() => setShowFollowersModal(true)}
                                                    className="hover:opacity-70 transition-opacity group"
                                                >
                                                    <p className="text-lg font-light">{stats.followers}</p>
                                                    <p className="text-[8px] text-neutral-400 uppercase tracking-wider flex items-center justify-center gap-1 group-hover:text-black transition-colors">
                                                        Followers
                                                        <span className="text-[8px] text-neutral-300 group-hover:text-black transition-colors">↗</span>
                                                    </p>
                                                </button>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-sm font-light">{stats.rating.toFixed(1)}</span>
                                                </div>
                                                <p className="text-[8px] text-neutral-400 uppercase tracking-wider">{renderStars(stats.rating)}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-light">{stats.reviews}</p>
                                                <p className="text-[8px] text-neutral-400 uppercase tracking-wider">Reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="border-t border-neutral-100 pt-4 space-y-3">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                                                Seller Type
                                            </p>
                                            <p className="text-sm capitalize text-neutral-700">
                                                {seller.seller_type || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                                                Location
                                            </p>
                                            <p className="text-sm text-neutral-700">
                                                {seller.location || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                                                Bio
                                            </p>
                                            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                                                {seller.bio || 'No shop bio yet.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions (2/3) */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 mb-12">
                            <div className="bg-white p-6">
                                <p className="text-2xl md:text-3xl font-light">{stats.totalProducts}</p>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Total Products</p>
                            </div>
                            <div className="bg-white p-6">
                                <p className="text-2xl md:text-3xl font-light">{stats.activeListings}</p>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Active Listings</p>
                            </div>
                            <div className="bg-white p-6">
                                <p className="text-2xl md:text-3xl font-light">{stats.totalOrders}</p>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Pending Orders</p>
                            </div>
                            <div className="bg-white p-6">
                                <p className="text-2xl md:text-3xl font-light">{stats.itemsSold}</p>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">Items Sold</p>
                            </div>
                        </div>
                        
                        {/* Active Actions */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                {actionItems.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.id}
                                            to={action.path}
                                            className="flex items-center justify-between border border-neutral-200 px-6 py-4 hover:border-black hover:bg-black group transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-neutral-400 group-hover:text-white transition-colors">
                                                    <Icon />
                                                </div>
                                                <span className="text-sm text-neutral-600 group-hover:text-white transition-colors">
                                                    {action.name}
                                                </span>
                                            </div>
                                            <Icons.ArrowRight />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Future Actions - Coming Soon */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-4">
                                Coming Soon
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {futureActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <div
                                            key={action.id}
                                            className="border border-neutral-200 px-6 py-4 bg-neutral-50 cursor-not-allowed opacity-60"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-neutral-300">
                                                    <Icon />
                                                </div>
                                                <span className="text-sm text-neutral-400">
                                                    {action.name}
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-neutral-300 uppercase tracking-wider mt-1 block">
                                                Coming Soon
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Followers Modal */}
            <FollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                sellerId={seller?.id}
                sellerName={seller?.shop_name}
                sellerAvatar={seller?.avatar_url}
            />
        </>
    );
}

export default SellerDashboard;