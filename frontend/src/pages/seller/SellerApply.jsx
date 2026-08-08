import { useSellerApplication } from '../../hooks/useSellerApplication';
import { Link } from 'react-router-dom';
import StepProgress from '../../components/SellerApply/StepProgress';
import FileUpload from '../../components/SellerApply/FileUpload';
import FormSection from '../../components/SellerApply/FormSection';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

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
        hasPendingApplication,
        applicationStatus,
        isInitialized,
        setBusinessType,
        handleChange,
        handleUpload,
        removeFile,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        resetRejectedStatus,
    } = useSellerApplication();

    // Loading state
    if (!isInitialized || fetchingOptions) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <LoadingSpinner message="Verifying Merchant Profile Status..." />
            </div>
        );
    }

    // Pending application
    if (hasPendingApplication && applicationStatus === 'pending') {
        return (
            <div className="bg-neutral-50 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-neutral-200 p-10 rounded-2xl text-center">
                    <EmptyState
                        icon="⏳"
                        title="Application Under Review"
                        subtitle="Your seller account application is currently being verified by our compliance team. This typically takes 1-2 business days."
                        actionLabel="Return to Home"
                        actionLink="/"
                    />
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-8 text-left">
                        <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-[0.2em] mb-2">What happens next?</p>
                        <p className="text-xs text-amber-700 leading-relaxed font-light">
                            We will notify you via email (<span className="font-medium">{formData.business_email || 'registered email'}</span>) once your store is approved and ready to launch.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Rejected application
    if (applicationStatus === 'rejected') {
        return (
            <div className="bg-neutral-50 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-neutral-200 p-10 rounded-2xl text-center">
                    <EmptyState
                        icon="⚠️"
                        title="Application Requires Attention"
                        subtitle="Your previous seller application could not be approved. You can edit your details and reapply immediately."
                        actionLabel="Update & Reapply"
                        onAction={resetRejectedStatus}
                    />
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-8 text-left">
                        <p className="text-[10px] font-semibold text-red-800 uppercase tracking-[0.2em] mb-2">Common Fixes</p>
                        <p className="text-xs text-red-700 leading-relaxed font-light">
                            Ensure your PAN document is fully legible, matching your exact corporate name, and your phone number is unique.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-50 min-h-screen pb-20 selection:bg-neutral-900 selection:text-white">

            {/* ─── Main Application Container ─── */}
            <main className="max-w-6xl mx-auto px-6 sm:px-12 pt-12">
                
                {/* ─── Page Title with Editorial Flair ─── */}
                <div className="mb-10">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 font-semibold block mb-3">
                        {isReapplying ? 'Resubmit Your Store Profile' : 'New Seller Program'}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-neutral-900">
                        {isReapplying ? 'Update & Resubmit' : 'Register as a Marketplace Seller'}
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 max-w-2xl leading-relaxed">
                        Expand your reach across Nepal. Complete the verification process to launch your store front on Nepal&apos;s dedicated clothing marketplace.
                    </p>
                </div>

                {/* ─── Grid Layout ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ─── Left Column: Form ─── */}
                    <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-8 sm:p-10">
                        
                        <div className="mb-10 pb-8 border-b border-neutral-100">
                            <StepProgress currentStep={currentStep} />
                        </div>

                        {error && (
                            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-xs text-red-700 flex items-start gap-3">
                                <span className="text-base mt-0.5">⚠️</span>
                                <div>
                                    <span className="font-semibold uppercase tracking-[0.1em] text-[10px] block mb-1">Action Required</span>
                                    {error}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="animate-fadeIn">
                            
                            {/* ════════════════════════════════════════ */}
                            {/* STEP 1: SHOP INFORMATION */}
                            {/* ════════════════════════════════════════ */}
                            {currentStep === 1 && (
                                <div className="space-y-8">

                                    {/* Business Type Selector */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-4">
                                            Seller Account Classification <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {['unregistered', 'registered'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setBusinessType(type)}
                                                    className={`p-5 border  rounded-xl text-left transition-all duration-300 ${
                                                        businessType === type
                                                            ? 'border-red-500 bg-neutral-50 shadow-sm'
                                                            : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-900">
                                                            {type === 'unregistered' ? 'Unregistered Business' : 'Registered Business'}
                                                        </h4>
                                                        {businessType === type && (
                                                            <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                                                        {type === 'unregistered'
                                                            ? 'Best for individual sellers and starting-out brands with no formal registration.'
                                                            : 'For legally registered companies holding valid documentation.'}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shop Name */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                            Shop Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="shop_name"
                                            value={formData.shop_name}
                                            onChange={handleChange}
                                            placeholder="e.g., Kathmandu Vintage Hub"
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all bg-white"
                                            required
                                        />
                                        <p className="text-[10px] text-neutral-400 mt-2 tracking-wide font-light">
                                            This name will be displayed publicly on all your product listing pages.
                                        </p>
                                    </div>

                                    {/* Shop Type / Category */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                            Shop Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="seller_type"
                                            value={formData.seller_type}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none bg-white cursor-pointer transition-all"
                                            required
                                        >
                                            <option value="">— Choose Category —</option>
                                            {sellerTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {capitalizeSellerType(type)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                            Shop / Pickup Location {isBusiness && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder={isBusiness ? "e.g., Jhamsikhel, Lalitpur" : "e.g., Jhamsikhel, Lalitpur"}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all bg-white"
                                            required={isBusiness}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                            Store Description <span className="text-neutral-400 font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Write a brief background story about your brand and products..."
                                            rows={3}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all resize-none bg-white"
                                        />
                                    </div>

                                    {/* Contact Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                                Business Phone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="business_phone"
                                                value={formData.business_phone}
                                                onChange={handleChange}
                                                placeholder="e.g., 9851234567"
                                                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all bg-white"
                                                required
                                            />
                                            <p className="text-[10px] text-neutral-400 mt-2 tracking-wide font-light">
                                                Used for customer notifications.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700 mb-2">
                                                Business Email <span className="text-neutral-400 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="business_email"
                                                value={formData.business_email}
                                                onChange={handleChange}
                                                placeholder="e.g., support@yourbrand.com"
                                                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="pt-2">
                                        <FileUpload
                                            label="Store Logo / Profile Icon"
                                            preview={previews.logo}
                                            onUpload={(file) => handleUpload('logo', file)}
                                            onRemove={() => removeFile('logo')}
                                            info="Supported formats: PNG, JPG, WebP (Max size: 2MB)"
                                        />
                                    </div>

                                    {/* Registered Business Supplemental Fields */}
                                    {isBusiness && (
                                        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-5">
                                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-700">
                                                Business Credentials
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 mb-2">
                                                        Registration Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="business_registration_number"
                                                        value={formData.business_registration_number}
                                                        onChange={handleChange}
                                                        placeholder="OCR registration code"
                                                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 mb-2">
                                                        PAN Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="pan_number"
                                                        value={formData.pan_number}
                                                        onChange={handleChange}
                                                        placeholder="9-digit PAN code"
                                                        className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-6 border-t border-neutral-100">
                                        <button
                                            type="button"
                                            onClick={goToNextStep}
                                            className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                                        >
                                            Next: Identity Verification →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════════════════════════════ */}
                            {/* STEP 2: IDENTITY VERIFICATION */}
                            {/* ════════════════════════════════════════ */}
                            {currentStep === 2 && (
                                <div className="space-y-8">

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-xs text-blue-800 leading-relaxed flex items-start gap-3">
                                        <span className="text-base">💡</span>
                                        <div>
                                            <span className="font-semibold uppercase tracking-[0.1em] text-[10px] block mb-1">Guidelines</span>
                                            Please upload clear, uncropped photos of your original Citizenship Certificate, Passport, or Valid Driving License. Blurry images will lead to application rejections.
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FileUpload
                                            label="Government ID (Front Side)"
                                            preview={previews.identity_front}
                                            onUpload={(file) => handleUpload('identity_front', file)}
                                            onRemove={() => removeFile('identity_front')}
                                            required
                                            info="Front profile photo"
                                            isDocument={false}
                                        />

                                        <FileUpload
                                            label="Government ID (Back Side)"
                                            preview={previews.identity_back}
                                            onUpload={(file) => handleUpload('identity_back', file)}
                                            onRemove={() => removeFile('identity_back')}
                                            required
                                            info="Back profile photo"
                                            isDocument={false}
                                        />
                                    </div>

                                    <div className="flex justify-between pt-6 border-t border-neutral-100">
                                        <button
                                            type="button"
                                            onClick={goToPreviousStep}
                                            className="border border-neutral-200 bg-white text-neutral-700 px-8 py-3.5 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-neutral-50 transition-all"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goToNextStep}
                                            className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                                        >
                                            Next: Business Documents →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ════════════════════════════════════════ */}
                            {/* STEP 3: DOCUMENTS & SUBMISSION */}
                            {/* ════════════════════════════════════════ */}
                            {currentStep === 3 && (
                                <div className="space-y-8">

                                    {isBusiness ? (
                                        <div className="space-y-5">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-800">
                                                <span className="font-semibold uppercase tracking-[0.1em] text-[10px] block mb-1">Required Corporate Files</span>
                                                Please upload scanned copies or crisp PDF documents issued by the Inland Revenue Department and Office of Company Registrar (OCR).
                                            </div>

                                            <FileUpload
                                                label="PAN Certificate"
                                                preview={previews.pan_certificate}
                                                onUpload={(file) => handleUpload('pan_certificate', file)}
                                                onRemove={() => removeFile('pan_certificate')}
                                                required
                                                info="Inland Revenue Dept certificate (JPG, PNG, PDF)"
                                                isDocument={true}
                                            />

                                            <FileUpload
                                                label="Company Registration Certificate"
                                                preview={previews.registration_certificate}
                                                onUpload={(file) => handleUpload('registration_certificate', file)}
                                                onRemove={() => removeFile('registration_certificate')}
                                                required
                                                info="OCR Company Certificate (JPG, PNG, PDF)"
                                                isDocument={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                                            <div className="text-4xl mb-3">🎉</div>
                                            <h3 className="text-sm font-medium text-emerald-900 uppercase tracking-[0.15em]">Ready for Final Review!</h3>
                                            <p className="text-xs text-emerald-700 mt-2 max-w-sm mx-auto font-light">
                                                As an independent seller, no additional registry certificates are required. Click submit to process your application.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between pt-6 border-t border-neutral-100">
                                        <button
                                            type="button"
                                            onClick={goToPreviousStep}
                                            className="border border-neutral-200 bg-white text-neutral-700 px-8 py-3.5 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-neutral-50 transition-all"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-neutral-900 text-white px-10 py-3.5 rounded-full text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-sm"
                                        >
                                            {loading ? 'Submitting...' : isReapplying ? 'Resubmit Profile' : 'Submit Application'}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>

                    {/* ─── Right Column: Support & Info ─── */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Help Card */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-900 mb-5 flex items-center gap-2">
                                <span>❓</span> Seller Help Center
                            </h3>
                            <ul className="space-y-4 text-xs text-neutral-600 font-light">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-sm">•</span>
                                    <span>Applications reviewed within 24 to 48 hours.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-sm">•</span>
                                    <span>Keep your phone number active for SMS updates.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 text-sm">•</span>
                                    <span>Need custom onboarding? Contact our team.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Benefits Card */}
                        <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-8">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400 mb-5">
                                Why Sell on DropFound?
                            </h3>
                            <div className="space-y-4 text-xs text-neutral-300 font-light">
                                <p><span className="text-white font-medium">Zero Listing Fees:</span> Create your product catalog completely free.</p>
                                <p><span className="text-white font-medium">Nationwide Reach:</span> Access thousands of fashion enthusiasts across Nepal.</p>
                                <p><span className="text-white font-medium">Automated Payouts:</span> Direct weekly bank settlements.</p>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}

export default SellerApply;