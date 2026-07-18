// components/FollowersModal.jsx
import { useState, useEffect } from 'react';
import { getSellerFollowers } from '../api/follow';
import { Icons } from './Icons';

function FollowersModal({ isOpen, onClose, sellerId, sellerName }) {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && sellerId) {
            fetchFollowers();
        }
    }, [isOpen, sellerId]);

    const fetchFollowers = async () => {
        try {
            setLoading(true);
            const res = await getSellerFollowers(sellerId);
            setFollowers(res.data.followers || []);
        } catch (err) {
            console.error('Failed to fetch followers:', err);
            setError('Failed to load followers');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-md max-h-[80vh] flex flex-col shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                    <h3 className="text-sm font-light uppercase tracking-[0.2em] text-black">
                        Followers
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
                    ) : followers.length === 0 ? (
                        <p className="text-sm text-neutral-400 text-center py-8">
                            No followers yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {followers.map((follower) => (
                                <div 
                                    key={follower.id} 
                                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-sm transition-colors"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600">
                                        {follower.first_name?.[0] || '?'}
                                        {follower.last_name?.[0] || ''}
                                    </div>
                                    {/* Name */}
                                    <div>
                                        <p className="text-sm font-medium text-neutral-800">
                                            {follower.first_name} {follower.last_name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider text-center">
                        {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FollowersModal;