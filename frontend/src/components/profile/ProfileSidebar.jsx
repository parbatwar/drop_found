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
            <div className="border border-neutral-100 p-6 md:p-8 sticky top-24">
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center text-2xl font-light text-neutral-500 border border-neutral-200">
                        {initials}
                    </div>
                    
                    <h2 className="mt-5 text-lg font-light">
                        {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">
                        {user?.email}
                    </p>
                    
                    {isSeller && (
                        <span className="mt-2 text-[9px] tracking-[0.2em] uppercase bg-black text-white px-3 py-1">
                            Seller
                        </span>
                    )}

                    <div className="text-center mt-6 pt-6 border-t border-neutral-100 w-full">
                        <p className="text-lg font-light">
                            {loadingCount ? '...' : followingCount}
                        </p>
                        <button
                            onClick={onFollowingClick}
                            className="text-[9px] text-neutral-400 uppercase tracking-wider hover:text-black transition-colors hover:underline"
                        >
                            Following
                        </button>
                    </div>

                    <div className="mt-8 w-full space-y-2 border-t border-neutral-100 pt-6">
                        <button
                            onClick={onEditToggle}
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
                            onClick={onLogout} 
                            className="w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-red-500 transition-colors duration-300"
                        >
                            <Icons.Logout className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default ProfileSidebar;