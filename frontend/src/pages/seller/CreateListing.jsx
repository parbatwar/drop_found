import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../api/listings';
import { getMySellerProfile } from '../../api/seller';
import { getListingOptions } from '../../api/meta';
import axios from 'axios';

function CreateListing() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [seller, setSeller] = useState(null);
    const [loadingSeller, setLoadingSeller] = useState(true);
    const [options, setOptions] = useState(null);

    // Form data state matching SQLAlchemy structure
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        size: '',
    });

    // Image pipeline state
    const [images, setImages] = useState([]); // Array of { file, previewUrl }
    const [uploadingImages, setUploadingImages] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            getMySellerProfile(),
            getListingOptions(),
        ])
            .then(([sellerRes, optionsRes]) => {
                setSeller(sellerRes.data);
                setOptions(optionsRes.data);
            })
            .catch((err) => {
                console.error(err);
                setError('Could not load layout configurations safely.');
            })
            .finally(() => setLoadingSeller(false));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle selecting local image files
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const mappedImages = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...mappedImages]);
    };

    // Remove local image before uploading
    const removeImageLocal = (indexToRemove) => {
        setImages((prev) => {
            const updated = prev.filter((_, idx) => idx !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].previewUrl); // Prevent memory leaks
            return updated;
        });
    };

    // Sequential Cloudinary direct upload pipeline
    const uploadImagesToCloudinary = async () => {
        const uploadedUrls = [];
        const CLOUD_NAME = "fk8ildu5";
        const UPLOAD_PRESET = "duzchcrj"; 

        for (let img of images) {
            const data = new FormData();
            data.append('file', img.file);
            data.append('upload_preset', UPLOAD_PRESET);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data
            );
            uploadedUrls.push(res.data.secure_url);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (images.length === 0) {
            setError('Please upload at least one image asset for your product collection.');
            return;
        }

        setSubmitting(true);

        try {
            setUploadingImages(true);
            const imageUrlsList = await uploadImagesToCloudinary();
            setUploadingImages(false);

            // Construct payload matching Listing & ListingImage models
            const payload = {
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                section: seller.seller_type, // Auto-derived segment context
                price: parseFloat(formData.price),
                condition: formData.condition || null,
                size: formData.size || null,
                // Nested collection corresponding directly to your backend schema relationships
                images: imageUrlsList.map((url, index) => ({
                    image_url: url,
                    display_order: index,
                })),
            };

            await createListing(payload);
            navigate('/seller/listings');
        } catch (err) {
            console.error('Create listing process aborted:', err);
            setError(err.response?.data?.detail || 'Failed to successfully publish product listing to repository.');
            setUploadingImages(false);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingSeller) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Studio Config...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-neutral-900 py-16 md:py-24">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                
                {/* Header Block */}
                <div className="space-y-3 mb-12 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                        Studio / Inventory Control
                    </span>
                    <h1 className="text-3xl font-light tracking-[0.08em] text-black uppercase">
                        New Listing
                    </h1>
                </div>

                {/* Status Interventions */}
                {error && (
                    <div className="bg-neutral-50 border-l-2 border-black text-neutral-800 px-4 py-3 text-xs tracking-wide mb-8 uppercase">
                        <span className="font-medium text-black">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Minimalist Grid Gallery Uploader */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-3">
                            Collection Gallery Visuals *
                        </label>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-[3/4] bg-neutral-50 border border-neutral-100 group overflow-hidden rounded-sm">
                                    <img 
                                        src={img.previewUrl} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImageLocal(index)}
                                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-[10px] uppercase tracking-widest font-light"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {/* Trigger Block */}
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="aspect-[3/4] border border-dashed border-neutral-200 hover:border-black flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 p-4 text-center bg-neutral-50 rounded-sm"
                            >
                                <span className="text-xl font-light text-neutral-400">+</span>
                                <span className="text-[9px] tracking-widest uppercase text-neutral-400 mt-1">Add Image</span>
                            </div>
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
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Raw Denim Boxy Jacket"
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none placeholder-neutral-300"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Archival Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detail structural tailoring, composition weights, historical provenance..."
                            rows={4}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none resize-none placeholder-neutral-300"
                        />
                    </div>

                    {/* Price and Category Layout Split */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                                Valuation (NPR) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none placeholder-neutral-300"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none cursor-pointer capitalize"
                                required
                            >
                                <option value="">Select</option>
                                {options?.categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.replaceAll('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Condition Split Rule */}
                    <div className="grid grid-cols-2 gap-4">
                        {seller?.seller_type === 'thrift' ? (
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                                    Condition Grade *
                                </label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none cursor-pointer capitalize"
                                    required
                                >
                                    <option value="">Select Condition</option>
                                    {options?.conditions.map((cond) => (
                                        <option key={cond} value={cond}>
                                            {cond.replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="bg-neutral-50 p-3 flex flex-col justify-center border border-neutral-100 rounded-sm">
                                <span className="text-[9px] tracking-widest uppercase text-neutral-400 font-medium block">Stock Category</span>
                                <span className="text-xs uppercase font-light text-black tracking-wide mt-0.5">Surplus Deployment</span>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div>
                            <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                                Measurement Size
                            </label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none cursor-pointer uppercase"
                            >
                                <option value="">None</option>
                                {options?.sizes.map((sz) => (
                                    <option key={sz} value={sz}>
                                        {sz.replaceAll('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white px-6 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed rounded-sm"
                        >
                            {uploadingImages ? 'Uploading Assets...' : submitting ? 'Publishing Record...' : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateListing;