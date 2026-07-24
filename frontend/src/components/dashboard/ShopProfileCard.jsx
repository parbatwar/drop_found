// components/dashboard/ShopProfileCard.jsx
import { Link } from 'react-router-dom';
import { Icons } from '../Icons';
import VerificationIcon from '../common/VerificationIcon';

function ShopProfileCard({ seller, stats, onFollowersClick, renderStars }) {
    const getStatusText = () => {
        if (seller.verification_status === 'approved') return '✓ Verified';
        if (seller.verification_status === 'pending') return '⏳ Under Review';
        if (seller.verification_status === 'rejected') return '✕ Not Approved';
        return 'Pending';
    };

    const getStatusColor = () => {
        if (seller.verification_status === 'approved') return 'text-green-600';
        if (seller.verification_status === 'pending') return 'text-amber-600';
        if (seller.verification_status === 'rejected') return 'text-red-600';
        return 'text-neutral-400';
    };

    const verificationType = seller.is_business_verified && seller.verification_status === 'approved' 
        ? 'business' 
        : seller.is_identity_verified && seller.verification_status === 'approved' 
            ? 'individual' 
            : null;

    return (
        <div className="border border-neutral-200 p-6 md:p-8 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    Shop Profile
                </h2>
                <Link to="/seller/shop/edit" className="text-neutral-400 hover:text-black transition-colors">
                    <Icons.Edit />
                </Link>
            </div>

            {seller && (
                <div className="space-y-5">
                    {/* Logo */}
                    <div className="flex justify-center">
                        {seller.avatar_url ? (
                            <img src={seller.avatar_url} alt={seller.shop_name} className="w-24 h-24 rounded-full object-cover border border-neutral-200" />
                        ) : (
                            <div className="w-24 h-24 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-300 text-[10px] uppercase tracking-widest">
                                No Logo
                            </div>
                        )}
                    </div>

                    {/* Shop Name with Verification Icon */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h3 className="text-lg font-light">{seller.shop_name}</h3>
                            {verificationType && <VerificationIcon type={verificationType} />}
                        </div>
                        <span className={`inline-block mt-1 text-[10px] uppercase tracking-widest ${getStatusColor()}`}>
                            {getStatusText()}
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="border-t border-neutral-100 pt-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <button onClick={onFollowersClick} className="hover:opacity-70 transition-opacity group">
                                <p className="text-lg font-light">{stats.followers}</p>
                                <p className="text-[8px] text-neutral-400 uppercase tracking-wider flex items-center justify-center gap-1 group-hover:text-black transition-colors">
                                    Followers
                                    <span className="text-[8px] text-neutral-300 group-hover:text-black transition-colors">↗</span>
                                </p>
                            </button>
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
                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Seller Type</p>
                            <p className="text-sm capitalize text-neutral-700">{seller.seller_type || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Location</p>
                            <p className="text-sm text-neutral-700">{seller.location || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Bio</p>
                            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">{seller.bio || 'No shop bio yet.'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShopProfileCard;