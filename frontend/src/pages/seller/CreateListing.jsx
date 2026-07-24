// src/pages/seller/CreateListing.jsx - Clean Version
import { useListingForm } from '../../hooks/useListingForm';
import { Icons } from '../../components/Icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FormField } from '../../components/common/FormField';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import { ImageUploadGrid } from '../../components/common/ImageUploadGrid';

function CreateListing() {
    const {
        loading,
        uploadingImages,
        submitting,
        error,
        formData,
        newImages,
        totalImages,
        isRetailer,
        fileInputRef,
        handleChange,
        handleImageChange,
        removeNewImage,
        handleSubmit,
        setFormData,
        options,
    } = useListingForm();

    if (loading) return <LoadingSpinner message="Loading Studio Config..." />;

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12">
                
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">Studio</span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">New Listing</h1>
                    <p className="text-sm text-neutral-500 mt-2">Add a new product to your collection.</p>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border-l-2 border-red-400 px-5 py-4 text-sm text-red-600 whitespace-pre-line">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Images */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                Product Images <span className="text-neutral-300">*</span>
                            </label>
                            <span className="text-[10px] text-neutral-400">{totalImages} / 6</span>
                        </div>
                        <ImageUploadGrid 
                            images={newImages} 
                            onAdd={() => fileInputRef.current?.click()} 
                            onRemove={removeNewImage} 
                        />
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" />
                    </div>

                    {/* Title */}
                    <FormField label="Product Title" required>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Raw Denim Boxy Jacket" className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors bg-transparent" required />
                    </FormField>

                    {/* Description */}
                    <FormField label="Description">
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detail the fabric, fit, condition, and story behind this piece..." rows={4} className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors resize-none bg-transparent" />
                    </FormField>

                    {/* Price & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Price (NPR)" required>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors bg-transparent" required min="0" step="0.01" />
                        </FormField>
                        <FormField label="Category" required>
                            <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors appearance-none cursor-pointer bg-transparent" required>
                                <option value="">Select Category</option>
                                {options?.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </FormField>
                    </div>

                    {/* Gender & Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Gender" required>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors appearance-none cursor-pointer bg-transparent capitalize" required>
                                <option value="">Select</option>
                                {options?.genders.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Quantity" required>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" step="1" className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors bg-transparent" required />
                        </FormField>
                    </div>

                    {/* Condition & Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isRetailer && (
                            <FormField label="Condition" required>
                                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors appearance-none cursor-pointer bg-transparent capitalize" required>
                                    <option value="">Select Condition</option>
                                    {options?.conditions.map(c => <option key={c} value={c}>{c.replaceAll('_', ' ')}</option>)}
                                </select>
                            </FormField>
                        )}
                        <div className={!isRetailer ? 'md:col-span-2' : ''}>
                            <FormField label="Size">
                                <select name="size" value={formData.size} onChange={handleChange} className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors appearance-none cursor-pointer bg-transparent uppercase">
                                    <option value="">Select Size</option>
                                    {options?.sizes.map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                                </select>
                            </FormField>
                        </div>
                    </div>

                    {/* Retailer-Only: Surplus Toggle */}
                    {isRetailer && (
                        <div className="border-t border-neutral-100 pt-6">
                            <h3 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-4">Inventory Tags</h3>
                            <ToggleSwitch
                                value={formData.is_surplus}
                                onChange={(val) => setFormData(prev => ({ ...prev, is_surplus: val }))}
                                label="Surplus"
                                description="Overstock, excess inventory"
                                activeColor="bg-amber-600"
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-6 border-t border-neutral-100">
                        <button type="submit" disabled={submitting} className="w-full bg-black text-white px-6 py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed">
                            {uploadingImages ? 'Uploading Images...' : submitting ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateListing;