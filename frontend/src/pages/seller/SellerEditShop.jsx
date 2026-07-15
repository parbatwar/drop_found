// src/pages/seller/SellerEditShop.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getMySellerProfile,
    updateSellerProfile,
} from '../../api/seller';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';


function SellerEditShop() {
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

        try {
            setUploadingLogo(true);

            const url = await uploadToCloudinary(file);

            setFormData((prev) => ({
                ...prev,
                avatar_url: url,
            }));
        } catch {
            setError('Failed to upload logo.');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError('');

        try {
            await updateSellerProfile({
                shop_name: formData.shop_name.trim(),
                bio: formData.bio.trim() || null,
                location: formData.location.trim() || null,
                avatar_url: formData.avatar_url || null,
            });

            navigate('/seller/shop');
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Failed to update shop.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-xl mx-auto px-6">

                <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                        Seller Shop
                    </p>

                    <h1 className="text-3xl uppercase font-light mt-2">
                        Edit Shop
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-xs uppercase mb-2">
                            Shop Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                        />

                        {uploadingLogo && (
                            <p className="mt-2 text-sm">
                                Uploading...
                            </p>
                        )}

                        {formData.avatar_url && (
                            <img
                                src={formData.avatar_url}
                                alt=""
                                className="mt-4 w-24 h-24 rounded-full object-cover border"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-xs uppercase mb-2">
                            Shop Name
                        </label>

                        <input
                            name="shop_name"
                            value={formData.shop_name}
                            onChange={handleChange}
                            className="w-full border px-4 py-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase mb-2">
                            Location
                        </label>

                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase mb-2">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            rows={5}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full border px-4 py-3"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/seller/shop')}
                            className="flex-1 border border-neutral-300 py-3 uppercase text-xs"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-black text-white py-3 uppercase text-xs"
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default SellerEditShop;