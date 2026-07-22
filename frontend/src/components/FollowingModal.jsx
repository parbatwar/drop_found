// components/FollowingModal.jsx
import { useState, useEffect } from 'react';
import { getFollowing } from '../api/follow';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';

function FollowingModal({ isOpen, onClose }) {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchFollowing();
        }
    }, [isOpen]);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            const res = await getFollowing();
            setFollowing(res.data || []);
        } catch (err) {
            console.error('Failed to fetch following:', err);
            setError('Failed to load following');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-md max-h-[80vh] flex flex-col shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                    <h3 className="text-sm font-light uppercase tracking-[0.2em] text-black">
                        Following
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-black transition-colors"
                    >
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                                Loading...
                            </div>
                        </div>
                    ) : error ? (
                        <p className="text-sm text-red-500 text-center py-8">{error}</p>
                    ) : following.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-neutral-400">You're not following any shops yet.</p>
                            <Link 
                                to="/shops" 
                                className="inline-block mt-3 text-[10px] tracking-[0.2em] uppercase border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors duration-300"
                                onClick={onClose}
                            >
                                Explore Shops
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {following.map((follow) => (
                                <Link
                                    key={follow.id}
                                    to={`/shop/${follow.seller.slug}`}
                                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-sm transition-colors group"
                                    onClick={onClose}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0">
                                        {follow.seller.avatar_url ? (
                                            <img 
                                                src={follow.seller.avatar_url} 
                                                alt={follow.seller.shop_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium">
                                                {follow.seller.shop_name?.[0]?.toUpperCase() || 'S'}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Shop Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-800 group-hover:text-black transition-colors truncate">
                                            {follow.seller.shop_name}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                            {follow.seller.seller_type || 'Shop'}
                                        </p>
                                    </div>
                                    
                                    <Icons.ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider text-center">
                        {following.length} {following.length === 1 ? 'shop' : 'shops'} followed
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FollowingModal;