// src/pages/seller/CreateListing.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../api/listings';
import { getMySellerProfile } from '../../api/seller';

function CreateListing() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [loadingSeller, setLoadingSeller] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        size: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // fetch seller profile on load to know their seller_type
    useEffect(() => {
        getMySellerProfile()
            .then((res) => setSeller(res.data))
            .catch((err) => {
                console.error(err);
                setError('Could not load your seller profile');
            })
            .finally(() => setLoadingSeller(false));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                section: seller.seller_type, // auto-set from seller's own type
                price: parseFloat(formData.price),
                condition: formData.condition || null,
                size: formData.size || null,
            };

            await createListing(payload);
            navigate('/seller/listings');
        } catch (err) {
            console.error('Create listing failed:', err);
            setError(err.response?.data?.detail || 'Failed to create listing');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingSeller) {
        return <p className="max-w-2xl mx-auto px-4 py-12 text-sm text-gray-400">Loading...</p>;
    }

    if (error && !seller) {
        return <p className="max-w-2xl mx-auto px-4 py-12 text-sm text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-light tracking-[0.1em] mb-2">New Listing</h1>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">
                {seller.seller_type} listing
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Price (NPR)
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="tops">Tops</option>
                        <option value="dresses">Dresses</option>
                        <option value="jacket">Jacket</option>
                        <option value="footwear">Footwear</option>
                        <option value="accessories">Accessories</option>
                        <option value="bags">Bags</option>
                        <option value="tshirts">T-Shirts</option>
                        <option value="shirts">Shirts</option>
                        <option value="pants">Pants</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Condition - only relevant for thrift sellers */}
                {seller.seller_type === 'thrift' && (
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                            Condition
                        </label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                        >
                            <option value="">Select condition</option>
                            <option value="like_new">Like New</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="okay">Okay</option>
                        </select>
                    </div>
                )}

                {/* Size */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Size (optional)
                    </label>
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                    >
                        <option value="">No size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                        <option value="free_size">Free Size</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {submitting ? 'Creating...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
}

export default CreateListing;