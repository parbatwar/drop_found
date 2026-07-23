// frontend/src/components/admin/DocumentViewerModal.jsx
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

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-neutral-100 shadow-lg rounded-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-light tracking-tight text-black">
                            Verification Documents
                        </h2>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            {seller.shop_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                                isBusiness(seller) 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'bg-green-50 text-green-600'
                            }`}>
                                {isBusiness(seller) ? 'Business' : 'Individual'}
                            </span>
                            {seller.business_phone && (
                                <span className="text-[9px] text-neutral-400">📞 {seller.business_phone}</span>
                            )}
                            {seller.business_email && (
                                <span className="text-[9px] text-neutral-400">✉️ {seller.business_email}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-black transition-colors"
                    >
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                    {/* Identity Documents */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3">
                            Identity Documents
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
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
                                <div className="col-span-2 text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded">
                                    No identity documents uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Business Documents */}
                    {isBusiness(seller) && (
                        <div className="border-t border-neutral-100 pt-6">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3">
                                Business Documents
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
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
                                    <div className="col-span-2 text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded">
                                        No business documents uploaded
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                                {seller.business_registration_number && (
                                    <div>
                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Registration Number</p>
                                        <p className="font-mono text-sm">{seller.business_registration_number}</p>
                                    </div>
                                )}
                                {seller.pan_number && (
                                    <div>
                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">PAN Number</p>
                                        <p className="font-mono text-sm">{seller.pan_number}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 sticky bottom-0">
                    {seller.verification_status === 'pending' && (
                        <>
                            <button
                                onClick={() => onApprove?.(seller.id)}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors rounded"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => onReject?.(seller.id)}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-red-300 text-red-500 hover:bg-red-50 transition-colors rounded"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ✅ Sub-component: Document Card
function DocumentCard({ label, url }) {
    return (
        <div className="border border-neutral-200 rounded overflow-hidden">
            <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-200 flex items-center justify-between">
                <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{label}</p>
                <button
                    onClick={() => window.open(url, '_blank')}
                    className="text-[8px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                </button>
            </div>
            <img 
                src={url} 
                alt={label}
                className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(url, '_blank')}
                onError={(e) => {
                    e.target.src = '';
                    e.target.alt = 'Image failed to load';
                    e.target.className = 'w-full h-32 object-contain bg-neutral-100 text-neutral-400 text-xs flex items-center justify-center';
                }}
            />
        </div>
    );
}

export default DocumentViewerModal;