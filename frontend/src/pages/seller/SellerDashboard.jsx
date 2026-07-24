// pages/seller/SellerDashboard.jsx - Refactored Version
import { useState } from 'react';
import { useSellerDashboard } from '../../hooks/useSellerDashboard';
import StatCard from '../../components/dashboard/StatCard';
import ActionCard from '../../components/dashboard/ActionCard';
import ShopProfileCard from '../../components/dashboard/ShopProfileCard';
import FollowersModal from '../../components/FollowersModal';
import { Icons } from '../../components/Icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function SellerDashboard() {
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const { seller, loading, stats, getVerificationType, renderStars } = useSellerDashboard();

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
        return <LoadingSpinner message="Loading Dashboard..." />;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Shop Profile */}
                    <div className="md:col-span-1">
                        <ShopProfileCard
                            seller={seller}
                            stats={stats}
                            onFollowersClick={() => setShowFollowersModal(true)}
                            renderStars={renderStars}
                        />
                    </div>

                    {/* Right Column - Actions */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 mb-12">
                            <StatCard value={stats.totalProducts} label="Total Products" />
                            <StatCard value={stats.activeListings} label="Active Listings" />
                            <StatCard value={stats.totalOrders} label="Pending Orders" />
                            <StatCard value={stats.itemsSold} label="Items Sold" />
                        </div>
                        
                        {/* Active Actions */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                {actionItems.map((action) => (
                                    <ActionCard
                                        key={action.id}
                                        to={action.path}
                                        icon={action.icon}
                                        label={action.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Future Actions */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-4">
                                Coming Soon
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {futureActions.map((action) => (
                                    <ActionCard
                                        key={action.id}
                                        icon={action.icon}
                                        label={action.name}
                                        comingSoon={true}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Followers Modal */}
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