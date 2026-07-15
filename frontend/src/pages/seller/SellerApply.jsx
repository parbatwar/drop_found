// src/pages/SellerApply.jsx
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

    // Run systemic account existence and meta verification options on mount
    useEffect(() => {
        const initializationSequence = async () => {
            try {
                // 1. Check if they already have a seller profile
                let existingRejectedProfile = null;

                try {
                    const profileCheck = await getMySellerProfile();
                    const status = profileCheck.data?.verification_status;

                    if (status === 'pending' || status === 'approved') {
                        // Already pending review or already approved — nothing to do here
                        navigate('/seller/dashboard', { replace: true });
                        return;
                    }

                    if (status === 'rejected') {
                        // Previously rejected — let them see the form again, pre-filled
                        existingRejectedProfile = profileCheck.data;
                        setIsReapplying(true);
                    }
                } catch (profileErr) {
                    // An error here likely means 404 (Not Found), which means they are clear to apply!
                    console.log("No existing seller profile detected. Proceeding with application configuration.");
                }

                // 2. Fetch enum options
                const optionsRes = await getSellerOptions();
                const types = optionsRes.data?.seller_types || [];
                setSellerTypes(types);

                // 3. Pre-fill form — either with previous rejected values, or a sensible default
                if (existingRejectedProfile) {
                    setFormData({
                        shop_name: existingRejectedProfile.shop_name || '',
                        bio: existingRejectedProfile.bio || '',
                        location: existingRejectedProfile.location || '',
                        seller_type: existingRejectedProfile.seller_type || (types[0] || ''),
                        avatar_url: existingRejectedProfile.avatar_url || '',
                    });
                } else if (types.length > 0) {
                    setFormData(prev => ({ ...prev, seller_type: types[0] }));
                }
            } catch (err) {
                console.error("Initialization failure within seller pipeline:", err);
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

        try {
            setUploadingLogo(true);

            const url = await uploadToCloudinary(file);

            setFormData(prev => ({
                ...prev,
                avatar_url: url,
            }));
        } catch (err) {
            setError('Failed to upload logo.');
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
                seller_type: formData.seller_type,
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
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Verifying Merchant Profile Status...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-neutral-900 py-16 md:py-24">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                
                {/* Header Layout */}
                <div className="space-y-3 mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                        Open a Shop
                    </span>
                    <h1 className="text-3xl font-light tracking-[0.08em] text-black uppercase">
                        {isReapplying ? 'Reapply as a Seller' : 'Seller Application'}
                    </h1>
                </div>

                {/* Reapplication Notice */}
                {isReapplying && !error && (
                    <div className="bg-neutral-50 border-l-2 border-neutral-400 text-neutral-800 px-4 py-3 text-xs tracking-wide mb-8 uppercase">
                        Your previous application was not approved. You can update the details below and resubmit.
                    </div>
                )}
                
                {/* Clean Status Interventions */}
                {error && (
                    <div className="bg-neutral-50 border-l-2 border-black text-neutral-800 px-4 py-3 text-xs tracking-wide mb-8 uppercase">
                        <span className="font-medium text-black">Status:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Shop Name */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Shop Name *
                        </label>
                        <input
                            type="text"
                            name="shop_name"
                            value={formData.shop_name}
                            onChange={handleChange}
                            placeholder="e.g., Kathmandu Vintage Hub"
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none"
                            required
                        />
                    </div>

                    {/* Dynamic Seller Type Dropdown Selector */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Seller Type *
                        </label>
                        <select
                            name="seller_type"
                            value={formData.seller_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none appearance-none cursor-pointer capitalize"
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                        >
                            {sellerTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Location Hub
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Jhamsikhel, Lalitpur"
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Shop Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your collection style..."
                            rows={4}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-2">
                            Shop Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="block w-full text-sm text-neutral-600"
                        />

                        {uploadingLogo && (
                            <p className="text-xs text-neutral-500 mt-2">
                                Uploading...
                            </p>
                        )}

                        {formData.avatar_url && (
                            <img
                                src={formData.avatar_url}
                                alt="Shop Logo"
                                className="mt-4 h-24 w-24 rounded-full object-cover border border-neutral-200"
                            />
                        )}
                    </div>

                    {/* Submit Handle Action */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white px-6 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting Application...' : (isReapplying ? 'Resubmit Application' : 'Submit Application')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SellerApply;