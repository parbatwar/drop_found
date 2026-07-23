// frontend/src/pages/seller/SellerApply.jsx
import { useSellerApplication } from '../../hooks/useSellerApplication';
import StepProgress from '../../components/SellerApply/StepProgress';
import FileUpload from '../../components/SellerApply/FileUpload';
import FormSection from '../../components/SellerApply/FormSection';

const capitalizeSellerType = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
};

function SellerApply() {
    const {
        currentStep,
        businessType,
        isBusiness,
        isReapplying,
        fetchingOptions,
        loading,
        error,
        formData,
        sellerTypes,
        previews,
        setBusinessType,
        handleChange,
        handleUpload,
        removeFile,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
    } = useSellerApplication();

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
            <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                
                {/* Header */}
                <div className="border-b border-neutral-100 pb-6 mb-12">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium block mb-3">
                        Become a Seller
                    </span>
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black leading-tight">
                        {isReapplying ? 'Reapply as a Seller' : 'Open Your Shop'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-md">
                        {isReapplying 
                            ? 'Update your shop details and resubmit your application.'
                            : 'Join Nepal\'s premier clothing marketplace. Start selling today.'}
                    </p>
                </div>

                <StepProgress currentStep={currentStep} />

                {error && (
                    <div className="mb-8 bg-red-50 border-l-2 border-red-400 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="animate-fadeIn">
                    
                    {/* ============================================ */}
                    {/* STEP 1: Shop Info */}
                    {/* ============================================ */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            {/* Business Type */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-3">
                                    Seller Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['individual', 'registered'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBusinessType(type)}
                                            className={`p-4 border text-left transition-colors ${
                                                businessType === type
                                                    ? 'border-black bg-neutral-50'
                                                    : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                        >
                                            <h4 className="text-sm font-medium capitalize">
                                                {type} Seller
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {type === 'individual' 
                                                    ? 'Personal seller, no business registration'
                                                    : 'Registered business with PAN/registration'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </FormSection>

                            {/* Shop Name */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Shop Name <span className="text-red-500">*</span>
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
                            </FormSection>

                            {/* Category */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="seller_type"
                                    value={formData.seller_type}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black focus:border-black outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {sellerTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {capitalizeSellerType(type)}
                                        </option>
                                    ))}
                                </select>
                            </FormSection>

                            {/* Location */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Location {isBusiness && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder={isBusiness 
                                        ? "e.g., Jhamsikhel, Lalitpur (Business address)" 
                                        : "e.g., Jhamsikhel, Lalitpur"
                                    }
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    required={isBusiness}
                                />
                                {isBusiness && (
                                    <p className="text-[8px] text-gray-400 mt-1">Your registered business address</p>
                                )}
                            </FormSection>

                            {/* Bio */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Shop Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your collection style..."
                                    rows={3}
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 resize-none bg-transparent"
                                />
                            </FormSection>

                            {/* Business Phone - Required for ALL */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Business Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="business_phone"
                                    value={formData.business_phone}
                                    onChange={handleChange}
                                    placeholder="e.g., 9851234567"
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    required
                                />
                                <p className="text-[8px] text-gray-400 mt-1">
                                    Will be used for order communications. Must be unique.
                                </p>
                            </FormSection>

                            {/* Business Email - Optional */}
                            <FormSection>
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                                    Business Email <span className="text-gray-400">(Optional)</span>
                                </label>
                                <input
                                    type="email"
                                    name="business_email"
                                    value={formData.business_email}
                                    onChange={handleChange}
                                    placeholder="e.g., info@yourshop.com"
                                    className="w-full border-b border-gray-200 px-0 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                />
                                <p className="text-[8px] text-gray-400 mt-1">
                                    Professional email for customer inquiries. Must be unique if provided.
                                </p>
                            </FormSection>

                            {/* Logo */}
                            <FileUpload
                                label="Shop Logo"
                                preview={previews.logo}
                                onUpload={(file) => handleUpload('logo', file)}
                                onRemove={() => removeFile('logo')}
                                info="PNG · JPG · WebP · Max 2MB"
                            />

                            {/* Business Details */}
                            {isBusiness && (
                                <FormSection title="Business Details *">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                                                Business Registration Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="business_registration_number"
                                                value={formData.business_registration_number}
                                                onChange={handleChange}
                                                placeholder="e.g., 123456789"
                                                className="w-full border-b border-gray-200 px-0 py-2 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors bg-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                                                PAN Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pan_number"
                                                value={formData.pan_number}
                                                onChange={handleChange}
                                                placeholder="e.g., 123456789"
                                                className="w-full border-b border-gray-200 px-0 py-2 text-sm text-black placeholder:text-gray-300 focus:border-black outline-none transition-colors bg-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </FormSection>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={goToNextStep}
                                    className="bg-black text-white px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ============================================ */}
                    {/* STEP 2: Identity */}
                    {/* ============================================ */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                                📸 Upload clear photos of your ID.
                                <br />
                                <span className="text-xs text-amber-600">Accepted: JPG, PNG, WebP (Max 2MB)</span>
                            </div>

                            {/* ✅ ID Front - Images only */}
                            <FileUpload
                                label="ID Front"
                                preview={previews.identity_front}
                                onUpload={(file) => handleUpload('identity_front', file)}
                                onRemove={() => removeFile('identity_front')}
                                required
                                info="Citizenship, Passport, or Driver's License (Front)"
                                isDocument={false}
                            />

                            {/* ✅ ID Back - Images only */}
                            <FileUpload
                                label="ID Back"
                                preview={previews.identity_back}
                                onUpload={(file) => handleUpload('identity_back', file)}
                                onRemove={() => removeFile('identity_back')}
                                required
                                info="Citizenship, Passport, or Driver's License (Back)"
                                isDocument={false}
                            />

                            {/* Selfie - Coming Soon */}
                            <div className="border border-dashed border-gray-300 p-4 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Selfie with ID</p>
                                        <p className="text-xs text-gray-400">
                                            Take a selfie holding your ID next to your face
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                Coming Soon
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousStep}
                                    className="border border-gray-300 px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-black transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNextStep}
                                    className="bg-black text-white px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ============================================ */}
                    {/* STEP 3: Documents */}
                    {/* ============================================ */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            {isBusiness ? (
                                <>
                                    <div className="bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                                        📄 Business verification required. Upload your documents below.
                                        <br />
                                        <span className="text-xs text-blue-600">Takes 2-3 business days.</span>
                                    </div>

                                    {/* ✅ PAN Certificate - Accepts PDF */}
                                    <FileUpload
                                        label="PAN Certificate"
                                        preview={previews.pan_certificate}
                                        onUpload={(file) => handleUpload('pan_certificate', file)}
                                        onRemove={() => removeFile('pan_certificate')}
                                        required
                                        info="PAN/VAT Certificate from Inland Revenue Department (JPG, PNG, or PDF)"
                                        isDocument={true}
                                    />

                                    {/* ✅ Registration Certificate - Accepts PDF */}
                                    <FileUpload
                                        label="Registration Certificate"
                                        preview={previews.registration_certificate}
                                        onUpload={(file) => handleUpload('registration_certificate', file)}
                                        onRemove={() => removeFile('registration_certificate')}
                                        required
                                        info="Company Registration Certificate from OCR (JPG, PNG, or PDF)"
                                        isDocument={true}
                                    />

                                    {/* Address Proof - Coming Soon */}
                                    <div className="border border-dashed border-gray-300 p-4 bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Business Address Proof</p>
                                                <p className="text-xs text-gray-400">
                                                    Utility bill, rental agreement, or bank statement showing business address
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        Coming Soon
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 text-sm text-gray-600 border border-gray-200">
                                        ⏳ Documents will be reviewed within 2-3 business days.
                                    </div>
                                </>
                            ) : (
                                <div className="bg-green-50 border border-green-200 p-6 text-center">
                                    <div className="text-4xl mb-4">✅</div>
                                    <h3 className="text-lg font-medium text-green-800">Ready to Submit!</h3>
                                    <p className="text-sm text-green-600 mt-2">
                                        Review will take 1-2 business days.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousStep}
                                    className="border border-gray-300 px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-black transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-black text-white px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : isReapplying ? 'Resubmit' : 'Submit Application'}
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}

export default SellerApply;