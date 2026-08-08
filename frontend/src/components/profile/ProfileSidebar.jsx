// components/profile/ProfileSidebar.jsx
import { Link } from 'react-router-dom';
import { Icons } from '../Icons';

function ProfileSidebar({ 
    user, 
    initials, 
    isSeller, 
    followingCount, 
    loadingCount,
    isEditing,
    onEditToggle,
    onLogout,
    onFollowingClick,
}) {
    return (
        <aside className="lg:col-span-4">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 sticky top-24 shadow-sm">
                <div className="flex flex-col items-center text-center">
                    
                    <div className="relative p-1 bg-neutral-200 rounded-full">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-xl font-medium text-neutral-800 uppercase tracking-wider overflow-hidden">
                            {initials}
                        </div>
                    </div>
                    
                    
                    {/* Name & Username / Email */}
                    <div className="mt-4">
                        <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5 font-normal">
                            {user?.email}
                        </p>
                    </div>
                    
                    {/* Seller Badge */}
                    {isSeller && (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-[10px] font-medium tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Verified Seller
                        </div>
                    )}

                    {/* Instagram-style Stat Pill */}
                    <div className="w-full mt-6 py-3 px-4 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center">
                        <button
                            onClick={onFollowingClick}
                            className="group flex items-center gap-2 text-center transition-opacity hover:opacity-80"
                        >
                            <span className="text-sm font-semibold text-neutral-900">
                                {loadingCount ? '...' : followingCount}
                            </span>
                            <span className="text-xs text-neutral-500 font-normal group-hover:text-neutral-900 transition-colors">
                                Following
                            </span>
                        </button>
                    </div>

                    {/* Action Links & Buttons */}
                    <div className="mt-6 w-full space-y-2.5 pt-6 border-t border-neutral-100">
                        <button
                            onClick={onEditToggle}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium rounded-xl transition-all duration-200 ${
                                isEditing 
                                    ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200' 
                                    : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm'
                            }`}
                        >
                            <Icons.Edit className="w-3.5 h-3.5" />
                            {isEditing ? "Cancel Editing" : "Edit Profile"}
                        </button>
                        
                        {isSeller && (
                            <Link 
                                to="/seller/dashboard" 
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors duration-200"
                            >
                                <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Creator Dashboard
                            </Link>
                        )}
                        
                        <button 
                            onClick={onLogout} 
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                        >
                            <Icons.Logout className="w-3.5 h-3.5" />
                            Log Out
                        </button>
                    </div>

                </div>
            </div>
        </aside>
    );
}

export default ProfileSidebar;