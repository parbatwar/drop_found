// src/pages/seller/EditListing.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMySellerProfile } from '../../api/seller';
import { getListing, updateListing } from '../../api/listings';
import { getListingOptions } from '../../api/meta';
import { Icons } from '../../components/Icons';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

function EditListing() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    const [seller, setSeller] = useState(null);
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: 1,
        condition: '',
        category_id: '',
        gender: '',
        size: '',
        status: '',
        is_surplus: false,
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isRetailer = seller?.seller_type === 'retailer';

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sellerRes, listingRes, optionsRes] = await Promise.all([
                    getMySellerProfile(),
                    getListing(id),
                    getListingOptions(),
                ]);

                const listing = listingRes.data;

                setSeller(sellerRes.data);
                setOptions(optionsRes.data);

                setFormData({
                    title: listing.title || '',
                    description: listing.description || '',
                    price: listing.price ?? '',
                    quantity: listing.quantity ?? 1,
                    condition: listing.condition || '',
                    category_id: listing.category_id || '',
                    gender: listing.gender || '',
                    size: listing.size || '',
                    status: listing.status || '',
                    is_surplus: listing.is_surplus || false,
                });

                if (listing.images) {
                    setExistingImages(listing.images.sort((a, b) => a.display_order - b.display_order));
                }
            } catch (err) {
                console.error(err);
                setError('Could not load layout configurations safely.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setError('');
        const files = Array.from(e.target.files);
        
        const totalImages = existingImages.length + newImages.length + files.length;
        if (totalImages > 6) {
            setError('Maximum of 6 total images allowed.');
            return;
        }

        const mappedImages = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setNewImages((prev) => [...prev, ...mappedImages]);
    };

    const removeNewImageLocal = (indexToRemove) => {
        setNewImages((prev) => {
            const updated = prev.filter((_, idx) => idx !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].previewUrl);
            return updated;
        });
    };

    const removeExistingImage = (indexToRemove) => {
        setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ✅ Prevent duplicate submissions
        if (submitting) {
            console.log('⚠️ Already submitting, skipping...');
            return;
        }

        setError('');

        if (existingImages.length === 0 && newImages.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setSubmitting(true);

        try {
            let newlyUploadedUrls = [];
            if (newImages.length > 0) {
                setUploadingImages(true);
                newlyUploadedUrls = await Promise.all(
                    newImages.map((img) => uploadToCloudinary(img.file))
                );
                setUploadingImages(false);
            }

            const consolidatedImages = [
                ...existingImages.map((img) => img.image_url),
                ...newlyUploadedUrls
            ];

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                price: parseFloat(formData.price),
                quantity: Number(formData.quantity),
                category_id: formData.category_id,
                gender: formData.gender,
                condition: seller?.seller_type === "thrift" ? formData.condition || null : null,
                size: formData.size || null,
                status: formData.status,
                is_surplus: formData.is_surplus || false,
                images: consolidatedImages.map((url, index) => ({
                    image_url: url,
                    display_order: index,
                })),
            };

            await updateListing(id, payload);
            navigate('/seller/listings');
        } catch (err) {
            console.error('Update listing error:', err);
            setError(err.response?.data?.detail || 'Failed to update listing.');
            setUploadingImages(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Studio Config...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header with Status Toggle */}
                <div className="mb-10 border-b border-neutral-100 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                            Studio
                        </span>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                            Edit Listing
                        </h1>
                        <p className="text-sm text-neutral-500 mt-2">
                            Update your product details and imagery.
                        </p>
                    </div>
                    
                    {/* Status Toggle - Right Side */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ 
                                    ...prev, 
                                    status: prev.status === 'active' ? 'inactive' : 'active' 
                                }))}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                                    formData.status === 'active' ? 'bg-green-600' : 'bg-neutral-300'
                                }`}
                            >
                                <span 
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                        formData.status === 'active' ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                            <span className={`text-sm font-medium ${
                                formData.status === 'active' ? 'text-green-600' : 'text-neutral-400'
                            }`}>
                                {formData.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1 text-right">
                            {formData.status === 'active' ? 'Visible to customers' : 'Hidden from customers'}
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 bg-red-50 border-l-2 border-red-400 px-5 py-4 text-sm text-red-600 whitespace-pre-line">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Image Upload Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                Product Images <span className="text-neutral-300">*</span>
                            </label>
                            <span className="text-[10px] text-neutral-400">
                                {existingImages.length + newImages.length} / 6
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {/* Existing Images */}
                            {existingImages.map((img, index) => (
                                <div key={`db-${index}`} className="relative aspect-square bg-neutral-50 border border-neutral-200 overflow-hidden group">
                                    <img 
                                        src={img.image_url} 
                                        alt={`Product ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Icons.X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {/* New Images */}
                            {newImages.map((img, index) => (
                                <div key={`new-${index}`} className="relative aspect-square bg-neutral-50 border-2 border-neutral-200 overflow-hidden group">
                                    <img 
                                        src={img.previewUrl} 
                                        alt={`Upload ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImageLocal(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Icons.X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Image Button */}
                            {(existingImages.length + newImages.length) < 6 && (
                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    className="aspect-square border-2 border-dashed border-neutral-200 hover:border-black flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 bg-neutral-50"
                                >
                                    <Icons.Upload className="w-6 h-6 text-neutral-300" />
                                    <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-2">
                                        Add Image
                                    </span>
                                </div>
                            )}
                        </div>

                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                            Product Title <span className="text-neutral-300">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Raw Denim Boxy Jacket"
                            className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detail the fabric, fit, condition, and story behind this piece..."
                            rows={4}
                            className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 resize-none bg-transparent"
                        />
                    </div>

                    {/* Price, Category, Quantity Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Price (NPR) <span className="text-neutral-300">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Category <span className="text-neutral-300">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent"
                                required
                            >
                                <option value="">Select Category</option>
                                {options?.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Quantity <span className="text-neutral-300">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                step="1"
                                className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Gender & Size Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Gender <span className="text-neutral-300">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent capitalize"
                                required
                            >
                                <option value="">Select Gender</option>
                                {options?.genders.map((gender) => (
                                    <option key={gender} value={gender} className="capitalize">
                                        {gender}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                Size
                            </label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent uppercase"
                            >
                                <option value="">Select Size</option>
                                {options?.sizes.map((sz) => (
                                    <option key={sz} value={sz}>
                                        {sz.replaceAll('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Condition (Thrift only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {seller?.seller_type === 'thrift' && (
                            <div>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                    Condition <span className="text-neutral-300">*</span>
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent"
                                    required
                                >
                                    <option value="">Select Condition</option>
                                    {options?.conditions.map((cond) => (
                                        <option key={cond} value={cond} className="capitalize">
                                            {cond.replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* ✅ Retailer-Only Fields - Surplus */}
                    {isRetailer && (
                        <div className="border-t border-neutral-100 pt-6">
                            <h3 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-4">
                                Inventory Tags
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Surplus Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ 
                                            ...prev, 
                                            is_surplus: !prev.is_surplus 
                                        }))}
                                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${
                                            formData.is_surplus ? 'bg-amber-600' : 'bg-neutral-300'
                                        }`}
                                    >
                                        <span 
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                                formData.is_surplus ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <div>
                                        <span className="text-sm font-medium text-neutral-700">Surplus</span>
                                        <p className="text-[9px] text-neutral-400">Overstock, excess inventory</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-neutral-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white px-6 py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {uploadingImages ? 'Uploading Images...' : 
                             submitting ? 'Saving...' : 
                             'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditListing;