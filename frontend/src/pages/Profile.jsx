// pages/Profile.jsx - Refactored Version
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileForm from '../components/profile/ProfileForm';
import FollowingModal from '../components/FollowingModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Profile() {
    const navigate = useNavigate();
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const {
        user,
        isEditing,
        saving,
        followingCount,
        loadingCount,
        formData,
        isSeller,
        getInitials,
        handleChange,
        handleSave,
        handleLogout,
        setIsEditing,
    } = useProfile();

    if (!user) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Profile...
                </div>
            </div>
        );
    }

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
                    <ProfileSidebar
                        user={user}
                        initials={getInitials()}
                        isSeller={isSeller}
                        followingCount={followingCount}
                        loadingCount={loadingCount}
                        isEditing={isEditing}
                        onEditToggle={() => setIsEditing(!isEditing)}
                        onLogout={handleLogout}
                        onFollowingClick={() => setShowFollowingModal(true)}
                    />

                    {/* Main Content */}
                    <section className="lg:col-span-8">
                        <h2 className="text-sm font-light uppercase tracking-[0.2em] text-neutral-400 mb-8">
                            {isEditing ? 'Edit Account Details' : 'Account Details'}
                        </h2>

                        <ProfileForm
                            user={user}
                            formData={formData}
                            isEditing={isEditing}
                            saving={saving}
                            onChange={handleChange}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    </section>
                </div>
            </div>

            {/* Following Modal */}
            <FollowingModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
            />
        </div>
    );
}

export default Profile;