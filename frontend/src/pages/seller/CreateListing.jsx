// src/pages/seller/CreateListing.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../api/listings';
import { getMySellerProfile } from '../../api/seller';
import { getListingOptions } from '../../api/meta';
import { Icons } from '../../components/Icons';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';


function CreateListing() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [seller, setSeller] = useState(null);
    const [loadingSeller, setLoadingSeller] = useState(true);
    const [options, setOptions] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: 1,
        condition: '',
        category_id: '',
        gender: '',
        size: '',
    });

    const [images, setImages] = useState([]);
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

    const handleImageChange = (e) => {
        setError('');
        const files = Array.from(e.target.files);
        
        const totalImages = images.length + files.length;
        if (totalImages > 6) {
            setError('Maximum of 6 total images allowed.');
            return;
        }

        const mappedImages = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...mappedImages]);
    };

    const removeImageLocal = (indexToRemove) => {
        setImages((prev) => {
            const updated = prev.filter((_, idx) => idx !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].previewUrl);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (images.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setSubmitting(true);

        try {
            setUploadingImages(true);
            
            const imageUrlsList = await Promise.all(
                images.map((img) => uploadToCloudinary(img.file))
            );
            
            setUploadingImages(false);

            const payload = {
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                price: parseFloat(formData.price),
                quantity: Number(formData.quantity),
                condition: formData.condition || null,
                size: formData.size || null,
                images: imageUrlsList.map((url, index) => ({
                    image_url: url,
                    display_order: index,
                })),
            };

            await createListing(payload);
            navigate('/seller/listings');
        } catch (err) {
            console.error("Full error:", err.response?.data);

            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(detail.map((e) => `${e.loc.join(".")}: ${e.msg}`).join("\n"));
            } else {
                setError(detail || "Failed to create listing.");
            }

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
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Studio
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        New Listing
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        Add a new product to your collection.
                    </p>
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
                                {images.length} / 6
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((img, index) => (
                                <div key={index} className="relative aspect-square bg-neutral-50 border border-neutral-200 overflow-hidden group">
                                    <img 
                                        src={img.previewUrl} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImageLocal(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Icons.X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            {images.length < 6 && (
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

                    {/* Price & Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    {/* Gender & Quantity Row */}
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
                                <option value="">Select</option>
                                {options?.genders.map((gender) => (
                                    <option key={gender} value={gender}>
                                        {gender}
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

                    {/* Condition & Size Row */}
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
                                    className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent capitalize"
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
                        )}

                        <div className={seller?.seller_type !== 'thrift' ? 'md:col-span-2' : ''}>
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

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-neutral-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white px-6 py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {uploadingImages ? 'Uploading Images...' : 
                             submitting ? 'Publishing...' : 
                             'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateListing;