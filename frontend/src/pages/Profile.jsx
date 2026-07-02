// pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        avatar: ''
    });

    // Mock data - replace with API calls
    const [stats, setStats] = useState({
        followers: 124,
        following: 56,
        itemsSaved: 0,
        orders: 0
    });

    const isSeller = user?.role === 'seller' || user?.role === 'admin';

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                location: user.location || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        // API call to update profile
        setIsEditing(false);
        console.log('Profile updated:', formData);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // All tabs - but only 'profile' is functional for now
    const tabs = [
        { id: 'profile', label: 'My Profile' },
        { id: 'saved', label: 'Saved Items' },
        { id: 'orders', label: 'Orders' },
        { id: 'following', label: 'Following' },
        { id: 'settings', label: 'Settings' },
    ];

    // Coming Soon placeholder component
    const ComingSoon = ({ tabName }) => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-xl font-light mb-2">{tabName} Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-md">
                We're working on this feature. Check back soon!
            </p>
            <div className="mt-6 w-16 h-1 bg-gray-200 rounded-full">
                <div className="w-8 h-1 bg-black rounded-full animate-pulse"></div>
            </div>
        </div>
    );

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
                        {/* Avatar */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 relative flex items-center justify-center">
                                <span className="text-2xl font-light text-gray-600">
                                    {user.first_name?.charAt(0).toUpperCase()}
                                    {user.last_name?.charAt(0).toUpperCase()}
                                </span>
                                {isSeller && (
                                    <span className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] px-2 py-0.5 rounded-full">
                                        Seller
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg font-light">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            
                            {user.bio && (
                                <p className="text-sm text-gray-600 mt-3">{user.bio}</p>
                            )}
                            
                            {user.location && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <span>📍</span> {user.location}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-lg font-light">{stats.followers}</p>
                                    <p className="text-[10px] text-gray-400 tracking-wide uppercase">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-light">{stats.following}</p>
                                    <p className="text-[10px] text-gray-400 tracking-wide uppercase">Following</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-light">{stats.orders}</p>
                                    <p className="text-[10px] text-gray-400 tracking-wide uppercase">Orders</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setActiveTab('profile');
                                    setIsEditing(true);
                                }}
                                className="w-full mt-4 border border-black text-black px-4 py-2 text-sm tracking-[0.1em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full mt-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                                Logout
                            </button>

                            {/* Seller Dashboard Link - Only for Sellers */}
                            {isSeller && (
                                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                                    <Link
                                        to="/seller/dashboard"
                                        className="block w-full bg-black text-white px-4 py-3 text-sm tracking-[0.1em] uppercase text-center hover:bg-gray-800 transition-colors duration-300"
                                    >
                                        Go to Shop Dashboard
                                    </Link>
                                    <p className="text-[10px] text-gray-400 mt-2 text-center tracking-wide">
                                        Manage your shop, listings & sales
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Tabs */}
                    <div className="border-b border-gray-100 mb-6 overflow-x-auto">
                        <nav className="flex space-x-6 min-w-max">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        if (tab.id === 'profile') setIsEditing(false);
                                    }}
                                    className={`py-3 text-sm transition-colors duration-200 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'text-black border-b-2 border-black font-medium'
                                            : 'text-gray-400 hover:text-black'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white border border-gray-100 rounded-lg p-6 min-h-[400px]">
                        {/* My Profile Tab - Fully Functional */}
                        {activeTab === 'profile' && (
                            <div>
                                <h3 className="text-lg font-light mb-4">My Profile</h3>
                                
                                {isEditing ? (
                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                rows="3"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-black outline-none transition-colors"
                                                placeholder="Kathmandu, Nepal"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="bg-black text-white px-6 py-2 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="border border-gray-300 px-6 py-2 text-sm hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">First Name</p>
                                            <p className="text-sm">{user.first_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Last Name</p>
                                            <p className="text-sm">{user.last_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                                            <p className="text-sm">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                                            <p className="text-sm">{user.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
                                            <p className="text-sm capitalize">{user.role || 'Buyer'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Email Verified</p>
                                            <p className="text-sm">{user.is_email_verified ? 'Yes' : 'No'}</p>
                                        </div>
                                        {user.bio && (
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">Bio</p>
                                                <p className="text-sm">{user.bio}</p>
                                            </div>
                                        )}
                                        {user.location && (
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                                                <p className="text-sm">{user.location}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Saved Items Tab - Coming Soon */}
                        {activeTab === 'saved' && (
                            <ComingSoon tabName="Saved Items" />
                        )}

                        {/* Orders Tab - Coming Soon */}
                        {activeTab === 'orders' && (
                            <ComingSoon tabName="Orders" />
                        )}

                        {/* Following Tab - Coming Soon */}
                        {activeTab === 'following' && (
                            <ComingSoon tabName="Following" />
                        )}

                        {/* Settings Tab - Coming Soon */}
                        {activeTab === 'settings' && (
                            <ComingSoon tabName="Settings" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;