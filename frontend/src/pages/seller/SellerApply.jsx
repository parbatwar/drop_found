// src/pages/seller/SellerApply.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applySeller, getMySellerProfile } from '../../api/seller';
import { getSellerOptions } from '../../api/meta';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

function SellerApply() {
    const navigate = useNavigate();
    const [sellerTypes, setSellerTypes] = useState([]);
    
    const [formData, setFormData] = useState({
        shop_name: '',
        bio: '',
        location: '',
        seller_type: '',
        avatar_url: '',
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(true);
    const [isReapplying, setIsReapplying] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Helper function to capitalize seller types
    const capitalizeSellerType = (type) => {
        if (!type) return '';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    useEffect(() => {
        const initializationSequence = async () => {
            try {
                let existingRejectedProfile = null;

                try {
                    const profileCheck = await getMySellerProfile();
                    const status = profileCheck.data?.verification_status;

                    if (status === 'pending' || status === 'approved') {
                        navigate('/seller/dashboard', { replace: true });
                        return;
                    }

                    if (status === 'rejected') {
                        existingRejectedProfile = profileCheck.data;
                        setIsReapplying(true);
                    }
                } catch (profileErr) {
                    console.log("No existing seller profile detected.");
                }

                const optionsRes = await getSellerOptions();
                const types = optionsRes.data?.seller_types || [];
                setSellerTypes(types);

                if (existingRejectedProfile) {
                    setFormData({
                        shop_name: existingRejectedProfile.shop_name || '',
                        bio: existingRejectedProfile.bio || '',
                        location: existingRejectedProfile.location || '',
                        seller_type: existingRejectedProfile.seller_type || (types[0] || ''),
                        avatar_url: existingRejectedProfile.avatar_url || '',
                    });
                    if (existingRejectedProfile.avatar_url) {
                        setPreviewUrl(existingRejectedProfile.avatar_url);
                    }
                } else if (types.length > 0) {
                    setFormData(prev => ({ ...prev, seller_type: types[0] }));
                }
            } catch (err) {
                console.error("Initialization failure:", err);
                setError("Could not load backend configurations safely.");
            } finally {
                setFetchingOptions(false);
            }
        };

        initializationSequence();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            setUploadingLogo(true);
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({
                ...prev,
                avatar_url: url,
            }));
        } catch (err) {
            setError('Failed to upload logo. Please try again.');
            setPreviewUrl(null);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                shop_name: formData.shop_name.trim(),
                bio: formData.bio.trim() || null,
                location: formData.location.trim() || null,
                seller_type: formData.seller_type, // This stays lowercase for backend
                avatar_url: formData.avatar_url || null,
            };

            await applySeller(payload);
            
            navigate('/seller/dashboard', { 
                state: { message: 'Successfully applied as seller!' } 
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong while submitting your application.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingOptions) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-gray-400 animate-pulse">
                    Verifying Merchant Profile Status...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                
                {/* Header */}
                <div className="max-w-2xl mb-12">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium block mb-3">
                        Become a Seller
                    </span>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black leading-tight">
                        {isReapplying ? 'Reapply as a Seller' : 'Open Your Shop'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-md">
                        {isReapplying 
                            ? 'Update your shop details and resubmit your application to start selling.'
                            : 'Join Nepal\'s premier thrift and surplus marketplace. Start selling your curated pieces today.'}
                    </p>
                </div>

                {/* Notices */}
                {(isReapplying || error) && (
                    <div className="max-w-2xl mb-10">
                        {isReapplying && !error && (
                            <div className="bg-gray-50 px-5 py-4 text-sm text-gray-600 border-l-2 border-gray-400">
                                Your previous application was not approved. Please update your details below and resubmit.
                            </div>
                        )}
                        {error && !error.includes('too large') && !error.includes('format') && (
                            <div className="bg-red-50 px-5 py-4 text-sm text-red-600 border-l-2 border-red-400">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* Left Column - Form Fields */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shop Name */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Shop Name <span className="text-gray-300">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="shop_name"
                                    value={formData.shop_name}
                                    onChange={handleChange}
                                    placeholder="e.g., Kathmandu Vintage Hub"
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    required
                                />
                            </div>

                            {/* Seller Type - With Capitalized Display */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Seller Type <span className="text-gray-300">*</span>
                                </label>
                                <select
                                    name="seller_type"
                                    value={formData.seller_type}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent"
                                >
                                    {sellerTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {capitalizeSellerType(type)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Jhamsikhel, Lalitpur"
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Shop Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your collection style..."
                                    rows={4}
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 resize-none bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Right Column - Logo Upload */}
                        <div className="lg:col-span-1">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-4">
                                Shop Logo
                            </label>
                            
                            <div className="flex flex-col items-center">
                                {/* Upload Area */}
                                <div className={`w-full aspect-square bg-gray-50 border-2 overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-300 group ${
                                    error?.includes('too large') || error?.includes('format') 
                                        ? 'border-red-400 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}>
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Shop Logo Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <svg className={`w-10 h-10 mb-3 ${
                                                error?.includes('too large') || error?.includes('format') 
                                                    ? 'text-red-400' 
                                                    : 'text-gray-300'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
                                                Click to upload<br />shop logo
                                            </p>
                                            <p className="text-[10px] text-gray-300 mt-2">
                                                PNG · JPG · WebP · Max 2MB
                                            </p>
                                            <p className="text-[9px] text-gray-300 mt-1">
                                                Any size works · Square recommended
                                            </p>
                                            {(error?.includes('too large') || error?.includes('format')) && (
                                                <p className="text-[10px] text-red-500 mt-2 font-medium">
                                                    ⚠️ {error}
                                                </p>
                                            )}
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
                                
                                {/* Upload Status */}
                                <div className="mt-4 text-center">
                                    {previewUrl ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] text-gray-600">✓ Uploaded</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewUrl(null);
                                                    setFormData(prev => ({ ...prev, avatar_url: '' }));
                                                    setError('');
                                                }}
                                                className="text-[11px] text-gray-400 hover:text-black transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-300">
                                            Max 2MB · Any dimension accepted
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-md mx-auto block bg-black text-white px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : (isReapplying ? 'Resubmit Application' : 'Submit Application')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SellerApply;