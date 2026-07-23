// frontend/src/components/admin/DocumentViewerModal.jsx
import { useState } from 'react'; // ✅ Add this import
import { Icons } from '../Icons';

function DocumentViewerModal({ 
    isOpen, 
    onClose, 
    seller, 
    getDocumentUrl,
    isBusiness,
    onApprove,
    onReject,
}) {
    if (!isOpen || !seller) return null;

    const hasIdentityDocs = getDocumentUrl(seller, 'identity_front') || getDocumentUrl(seller, 'identity_back');
    const hasBusinessDocs = getDocumentUrl(seller, 'pan_certificate') || getDocumentUrl(seller, 'registration_certificate');

    // Helper to format seller type
    const getSellerTypeLabel = (type) => {
        if (!type) return 'Not specified';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl rounded-lg">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white z-10 rounded-t-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-light tracking-tight text-black">
                                    Verification Documents
                                </h2>
                            </div>
                            <p className="text-sm font-medium text-neutral-800 mt-1">
                                {seller.shop_name}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 rounded">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        isBusiness(seller) ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />
                                    {isBusiness(seller) ? 'Business' : 'Individual'}
                                </span>
                                {seller.business_phone && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 rounded">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {seller.business_phone}
                                    </span>
                                )}
                                {seller.business_email && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 rounded truncate max-w-[200px]">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{seller.business_email}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-black transition-colors flex-shrink-0 ml-4"
                        >
                            <Icons.X className="w-5 h-5" />
                        </button> 
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-8">
                    
                    {/* Business Details - Show for ALL sellers */}
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Shop Name</p>
                                <p className="text-sm font-medium text-neutral-800">{seller.shop_name}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Seller Type</p>
                                <p className="text-sm capitalize text-neutral-700">{getSellerTypeLabel(seller.seller_type)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Business Type</p>
                                <p className="text-sm capitalize text-neutral-700">{isBusiness(seller) ? 'Registered' : 'Individual'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Location</p>
                                <p className="text-sm text-neutral-700">{seller.location || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Identity Documents */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                                Identity Documents
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {getDocumentUrl(seller, 'identity_front') && (
                                <DocumentCard 
                                    label="ID Front" 
                                    url={getDocumentUrl(seller, 'identity_front')} 
                                />
                            )}
                            {getDocumentUrl(seller, 'identity_back') && (
                                <DocumentCard 
                                    label="ID Back" 
                                    url={getDocumentUrl(seller, 'identity_back')} 
                                />
                            )}
                            {!hasIdentityDocs && (
                                <div className="col-span-2 text-center py-10 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-lg">
                                    No identity documents uploaded
                                </div>
                            )}
                        </div>
                    </div>
  
                    {/* Business Documents - Only for registered businesses */}
                    {isBusiness(seller) && (
                        <div className="border-t border-neutral-100 pt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                                    Business Documents
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {getDocumentUrl(seller, 'pan_certificate') && (
                                    <DocumentCard 
                                        label="PAN Certificate" 
                                        url={getDocumentUrl(seller, 'pan_certificate')} 
                                    />
                                )}
                                {getDocumentUrl(seller, 'registration_certificate') && (
                                    <DocumentCard 
                                        label="Registration Certificate" 
                                        url={getDocumentUrl(seller, 'registration_certificate')} 
                                    />
                                )}
                                {!hasBusinessDocs && (
                                    <div className="col-span-2 text-center py-10 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-lg">
                                        No business documents uploaded
                                    </div>
                                )}
                            </div>
                            
                            {/* Business Numbers */}
                            {(seller.business_registration_number || seller.pan_number) && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                                    {seller.business_registration_number && (
                                        <div>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Registration Number</p>
                                            <p className="text-sm font-mono text-neutral-800">{seller.business_registration_number}</p>
                                        </div>
                                    )}
                                    {seller.pan_number && (
                                        <div>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">PAN Number</p>
                                            <p className="text-sm font-mono text-neutral-800">{seller.pan_number}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-end gap-3 sticky bottom-0 rounded-b-lg">
                    {seller.verification_status === 'pending' && (
                        <>
                            <button
                                onClick={() => onApprove?.(seller.id)}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors rounded-lg"
                            >
                                Approve Application
                            </button>
                            <button
                                onClick={() => onReject?.(seller.id)}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-red-300 text-red-500 hover:bg-red-50 transition-colors rounded-lg"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component: Document Card
function DocumentCard({ label, url }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
            <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between">
                <p className="text-[9px] text-neutral-600 font-medium uppercase tracking-wider">
                    {label}
                </p>
                <button
                    onClick={() => window.open(url, '_blank')}
                    className="text-[9px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                </button>
            </div>
            <div className="relative aspect-[4/3] bg-neutral-100">
                {!imageError ? (
                    <img 
                        src={url} 
                        alt={label}
                        className="w-full h-full object-contain p-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                        <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px]">Failed to load</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentViewerModal;