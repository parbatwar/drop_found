// pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icons } from "../components/Icons";
import { getFollowing } from "../api/follow";
import FollowingModal from "../components/FollowingModal";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
    });
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    
    // ✅ ADD THESE TWO LINES - they're missing
    const [followingCount, setFollowingCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    // ✅ This useEffect is complete
    useEffect(() => {
        const fetchFollowingCount = async () => {
            try {
                const res = await getFollowing();
                setFollowingCount(res.data?.length || 0);
            } catch (err) {
                console.error('Failed to fetch following count:', err);
            } finally {
                setLoadingCount(false);
            }
        };
        fetchFollowingCount();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Your update profile logic here
            setIsEditing(false);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Profile...
                </div>
            </div>
        );
    }

    const getInitials = () => {
        if (!user) return '?';
        const first = user.first_name?.charAt(0) || '';
        const last = user.last_name?.charAt(0) || '';
        return (first + last).toUpperCase() || '?';
    };

    const isSeller = user.role === "seller" || user.role === "admin";

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Account
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        My Profile
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        Manage your personal information and preferences.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="border border-neutral-100 p-6 md:p-8 sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-2xl font-light text-neutral-500 border border-neutral-200">
                                    {getInitials()}
                                </div>
                                
                                <h2 className="mt-5 text-lg font-light">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">
                                    {user.email}
                                </p>
                                
                                {isSeller && (
                                    <span className="mt-2 text-[9px] tracking-[0.2em] uppercase bg-black text-white px-3 py-1">
                                        Seller
                                    </span>
                                )}

                                {/* show Following count (personal) - ✅ This is correct */}
                                <div className="text-center mt-6 pt-6 border-t border-neutral-100 w-full">
                                    <p className="text-lg font-light">
                                        {loadingCount ? '...' : followingCount}
                                    </p>
                                    <button
                                        onClick={() => setShowFollowingModal(true)}
                                        className="text-[9px] text-neutral-400 uppercase tracking-wider hover:text-black transition-colors hover:underline"
                                    >
                                        Following
                                    </button>
                                </div>

                                <div className="mt-8 w-full space-y-2 border-t border-neutral-100 pt-6">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase border border-neutral-200 hover:border-black transition-colors duration-300"
                                    >
                                        <Icons.Edit className="w-3.5 h-3.5" />
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                    
                                    {isSeller && (
                                        <Link 
                                            to="/seller/dashboard" 
                                            className="w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase border border-neutral-200 hover:border-black transition-colors duration-300 text-center"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                    )}
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-red-500 transition-colors duration-300"
                                    >
                                        <Icons.Logout className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-8">
                        <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400 mb-8">
                            {isEditing ? 'Edit Account Details' : 'Account Details'}
                        </h2>

                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                            placeholder="Last name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                            Email
                                        </label>
                                        <p className="text-sm text-neutral-400 py-2.5 border-b border-neutral-100">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="border border-neutral-200 px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                {/* Account Details */}
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            First Name
                                        </p>
                                        <p className="text-sm text-neutral-700">
                                            {user.first_name || '-'}
                                        </p>
                                    </div>
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            Last Name
                                        </p>
                                        <p className="text-sm text-neutral-700">
                                            {user.last_name || '-'}
                                        </p>
                                    </div>
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            Email
                                        </p>
                                        <p className="text-sm text-neutral-700">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            Phone
                                        </p>
                                        <p className="text-sm text-neutral-700">
                                            {user.phone || 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            Role
                                        </p>
                                        <p className="text-sm text-neutral-700 capitalize">
                                            {user.role || 'Buyer'}
                                        </p>
                                    </div>
                                    <div className="border-b border-neutral-100 pb-4">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
                                            Email Verified
                                        </p>
                                        <p className="text-sm text-neutral-700 flex items-center gap-2">
                                            {user.is_email_verified ? (
                                                <>
                                                    <span className="text-green-600">Yes</span>
                                                    <Icons.Check className="w-4 h-4 text-green-600" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-amber-600">No</span>
                                                    <span className="text-[10px] text-neutral-400">(Verify your email)</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Seller Shop Link - Only if user is a seller */}
                                {isSeller && (
                                    <div className="border-t border-neutral-100 pt-8">
                                        <h3 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400 mb-4">
                                            Your Shop
                                        </h3>
                                        <Link 
                                            to={`/shop/${user.shop_slug}`}
                                            className="flex items-center gap-3 border border-neutral-100 p-4 hover:border-black transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0">
                                                {user.shop_avatar ? (
                                                    <img 
                                                        src={user.shop_avatar} 
                                                        alt={user.shop_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg font-light">
                                                        {user.shop_name?.[0]?.toUpperCase() || 'S'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{user.shop_name}</p>
                                                <p className="text-[10px] text-neutral-400">View your shop →</p>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Following Modal - Shows shops this user follows */}
            <FollowingModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
            />
        </div>
    );
}

export default Profile;