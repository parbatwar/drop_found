// src/pages/seller/SellerEdit.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getMySellerProfile,
    updateSellerProfile,
} from '../../api/seller';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

function SellerEdit() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        shop_name: '',
        bio: '',
        location: '',
        avatar_url: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [hasImage, setHasImage] = useState(false);
    const [imageRemoved, setImageRemoved] = useState(false); // ✅ Added

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getMySellerProfile();

                setFormData({
                    shop_name: res.data.shop_name || '',
                    bio: res.data.bio || '',
                    location: res.data.location || '',
                    avatar_url: res.data.avatar_url || '',
                });
                
                if (res.data.avatar_url) {
                    setPreviewUrl(res.data.avatar_url);
                    setHasImage(true);
                } else {
                    setHasImage(false);
                }
            } catch (err) {
                setError(
                    err.response?.data?.detail ||
                    'Unable to load shop profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            setError('Unsupported format. Please upload PNG, JPG, or WebP.');
            e.target.value = '';
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            setError(`File too large (${sizeInMB}MB). Maximum size is 2MB.`);
            e.target.value = '';
            return;
        }

        setError('');
        setImageRemoved(false); // ✅ Reset when uploading new image

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setHasImage(true);
        };
        reader.readAsDataURL(file);

        try {
            setUploadingLogo(true);
            const url = await uploadToCloudinary(file);
            setFormData((prev) => ({
                ...prev,
                avatar_url: url,
            }));
        } catch {
            setError('Failed to upload logo.');
            setPreviewUrl(null);
            setHasImage(false);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        setHasImage(false);
        setImageRemoved(true); // ✅ Mark as removed
        setFormData(prev => ({ ...prev, avatar_url: '' }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                shop_name: formData.shop_name.trim(),
                bio: formData.bio.trim() || null,
                location: formData.location.trim() || null,
            };

            // ✅ Handle avatar properly
            if (imageRemoved) {
                payload.avatar_url = null;
            } else if (formData.avatar_url) {
                payload.avatar_url = formData.avatar_url;
            } else {
                payload.avatar_url = null;
            }

            console.log('📤 Sending payload:', payload);

            await updateSellerProfile(payload);

            navigate('/seller/dashboard');
        } catch (err) {
            console.error('❌ Error:', err);
            setError(
                err.response?.data?.detail ||
                'Failed to update shop.'
            );
        } finally {
            setSaving(false);
        }
    };

    // Get initials from shop name
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Shop Profile...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Seller Shop
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        Edit Shop
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        Update your shop details and branding.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border-l-2 border-red-400 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        
                        {/* Left Column - Logo Upload */}
                        <div className="md:col-span-1">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-3">
                                Shop Logo
                            </label>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-full aspect-square bg-neutral-50 border-2 border-neutral-200 overflow-hidden flex flex-col items-center justify-center relative hover:border-neutral-400 transition-colors duration-300 group">
                                    {hasImage && previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Shop Logo Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                                                <span className="text-4xl font-light text-neutral-500">
                                                    {getInitials(formData.shop_name)}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                                                    Click to upload
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleLogoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    {uploadingLogo && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="text-white text-[10px] tracking-[0.2em] uppercase">
                                                Uploading...
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-3 text-center">
                                    {hasImage ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] text-green-600">✓ Uploaded</span>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-neutral-300">
                                            PNG · JPG · WebP · Max 2MB
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Shop Name */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                    Shop Name <span className="text-neutral-300">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="shop_name"
                                    value={formData.shop_name}
                                    onChange={handleChange}
                                    placeholder="e.g., Kathmandu Vintage Hub"
                                    className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Jhamsikhel, Lalitpur"
                                    className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                    Shop Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your collection style..."
                                    className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 resize-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-6 border-t border-neutral-100">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/seller/dashboard')}
                                className="flex-1 border border-neutral-200 px-6 py-3 text-[11px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-black text-white px-6 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SellerEdit;