// frontend/src/pages/admin/AdminSellers.jsx
import { useEffect, useState } from 'react';
import { getPendingSellers, reviewSeller } from '../../api/seller';
import { Icons } from '../../components/Icons';

function AdminSellers() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getPendingSellers();
            console.log('📦 Pending sellers response:', res.data);
            setApplications(res.data || []);
        } catch (err) {
            console.error("Failed fetching applications:", err);
            setError(err.response?.data?.detail || "Could not load pending applications.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status, verifyIdentity = false, verifyBusiness = false) => {
        setError('');
        setSuccessMessage('');
        setActionId(id);

        try {
            await reviewSeller(id, {
                status: status,
                verify_identity: verifyIdentity,
                verify_business: verifyBusiness,
            });
            setSuccessMessage(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (err) {
            console.error(`Action failed for ID ${id}:`, err);
            setError(err.response?.data?.detail || "Failed to process application.");
        } finally {
            setActionId(null);
        }
    };

    const getInitials = (shopName) => {
        if (!shopName) return '?';
        const words = shopName.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    const isBusiness = (app) => {
        return app.business_type === 'registered' || app.applied_as_business === true;
    };

    const getDocumentUrl = (app, docType) => {
        if (!app) return null;
        
        // 1. Check individual fields first (most reliable)
        const directMap = {
            'identity_front': app.identity_front_url,
            'identity_back': app.identity_back_url,
            'pan_certificate': app.pan_certificate_url,
            'registration_certificate': app.registration_certificate_url,
        };
        
        if (directMap[docType]) {
            return directMap[docType];
        }
        
        // 2. Check verification_documents JSON
        if (app.verification_documents) {
            const altKeys = {
                'identity_front': ['identity_front', 'identity_front_url', 'front_id'],
                'identity_back': ['identity_back', 'identity_back_url', 'back_id'],
                'pan_certificate': ['pan_certificate', 'pan_certificate_url', 'pan'],
                'registration_certificate': ['registration_certificate', 'registration_certificate_url', 'registration'],
            };
            const keys = altKeys[docType] || [docType];
            for (const key of keys) {
                if (app.verification_documents[key]) {
                    return app.verification_documents[key];
                }
            }
        }
        
        return null;
    };

    // ✅ Check if any documents exist
    const hasDocuments = (app) => {
        const docTypes = ['identity_front', 'identity_back', 'pan_certificate', 'registration_certificate'];
        return docTypes.some(type => getDocumentUrl(app, type));
    };

    // ✅ Debug: Log what's available when modal opens
    const openDocumentModal = (app) => {
        console.log('🔍 Opening document modal for:', app.shop_name);
        console.log('🔍 Full app object:', app);
        console.log('🔍 Verification Documents JSON:', app.verification_documents);
        console.log('🔍 Identity Front URL:', app.identity_front_url);
        console.log('🔍 Identity Back URL:', app.identity_back_url);
        console.log('🔍 PAN Certificate URL:', app.pan_certificate_url);
        console.log('🔍 Registration Certificate URL:', app.registration_certificate_url);
        console.log('🔍 All keys:', Object.keys(app));
        
        // Check each document type
        const docTypes = ['identity_front', 'identity_back', 'pan_certificate', 'registration_certificate'];
        docTypes.forEach(type => {
            const url = getDocumentUrl(app, type);
            console.log(`🔍 ${type} URL:`, url);
        });
        
        setSelectedApplication(app);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Applications...
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                            <Icons.Users className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight text-black">
                                Pending Sellers
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Review and manage seller applications with verification documents.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-light text-neutral-300">
                        {applications.length}
                    </span>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                        Pending
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 bg-green-50 border-l-2 border-green-400 px-4 py-3 text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            {/* Applications List */}
            {applications.length === 0 ? (
                <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                    <div className="text-4xl font-light text-neutral-300 mb-3">📋</div>
                    <p className="text-sm text-neutral-400 uppercase tracking-wider">
                        No pending applications
                    </p>
                    <p className="text-[10px] text-neutral-300 mt-1">
                        All seller applications have been reviewed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div 
                            key={app.id} 
                            className="bg-white border border-neutral-100 p-5 hover:border-neutral-300 transition-colors duration-200"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Application Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-500 flex-shrink-0">
                                            {getInitials(app.shop_name)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-light text-neutral-900">
                                                {app.shop_name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                                                    {app.seller_type}
                                                </span>
                                                <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                                                    isBusiness(app) 
                                                        ? 'bg-blue-50 text-blue-600' 
                                                        : 'bg-green-50 text-green-600'
                                                }`}>
                                                    {isBusiness(app) ? 'Business' : 'Individual'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {app.bio && (
                                        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                                            {app.bio}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        {app.location && (
                                            <span className="text-[9px] text-neutral-400 flex items-center gap-1">
                                                <Icons.Location className="w-3 h-3" />
                                                {app.location}
                                            </span>
                                        )}
                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                            Applied: {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                        {app.business_phone && (
                                            <span className="text-[9px] text-neutral-400">
                                                📞 {app.business_phone}
                                            </span>
                                        )}
                                        {hasDocuments(app) && (
                                            <span className="text-[9px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                                📎 Documents Uploaded
                                            </span>
                                        )}
                                        <button
                                            onClick={() => openDocumentModal(app)}
                                            className="text-[9px] text-blue-600 hover:text-blue-800 underline transition-colors"
                                        >
                                            View Documents
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2.5 flex-shrink-0">
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'approved', true, isBusiness(app))}
                                        className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                    >
                                        <Icons.Check className="w-3.5 h-3.5" />
                                        {actionId === app.id ? '...' : 'Approve'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'rejected', false, false)}
                                        className="flex items-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:border-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
                                    >
                                        <Icons.X className="w-3.5 h-3.5" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Document Details Modal */}
            {showDetailsModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0" onClick={() => setShowDetailsModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-neutral-100 shadow-lg">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                            <div>
                                <h2 className="text-lg font-light tracking-tight text-black">
                                    Verification Documents
                                </h2>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                    {selectedApplication.shop_name}
                                </p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                                        isBusiness(selectedApplication) 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'bg-green-50 text-green-600'
                                    }`}>
                                        {isBusiness(selectedApplication) ? 'Business' : 'Individual'}
                                    </span>
                                    {selectedApplication.business_phone && (
                                        <span className="text-[9px] text-neutral-400">
                                            📞 {selectedApplication.business_phone}
                                        </span>
                                    )}
                                    {selectedApplication.business_email && (
                                        <span className="text-[9px] text-neutral-400">
                                            ✉️ {selectedApplication.business_email}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDetailsModal(false)}
                                className="text-neutral-400 hover:text-black transition-colors"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-6">

                            {/* Identity Documents */}
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3">
                                    Identity Documents
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {getDocumentUrl(selectedApplication, 'identity_front') && (
                                        <div className="border border-neutral-200 rounded overflow-hidden">
                                            <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-200">
                                                <p className="text-[9px] text-neutral-500 uppercase tracking-wider">ID Front</p>
                                            </div>
                                            <img 
                                                src={getDocumentUrl(selectedApplication, 'identity_front')} 
                                                alt="ID Front"
                                                className="w-full h-auto object-cover"
                                                onClick={() => window.open(getDocumentUrl(selectedApplication, 'identity_front'), '_blank')}
                                                onError={(e) => {
                                                    e.target.src = '';
                                                    e.target.alt = 'Image failed to load';
                                                    e.target.className = 'w-full h-32 object-contain bg-neutral-100 text-neutral-400 text-xs flex items-center justify-center';
                                                }}
                                            />
                                        </div>
                                    )}
                                    {getDocumentUrl(selectedApplication, 'identity_back') && (
                                        <div className="border border-neutral-200 rounded overflow-hidden">
                                            <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-200">
                                                <p className="text-[9px] text-neutral-500 uppercase tracking-wider">ID Back</p>
                                            </div>
                                            <img 
                                                src={getDocumentUrl(selectedApplication, 'identity_back')} 
                                                alt="ID Back"
                                                className="w-full h-auto object-cover"
                                                onError={(e) => {
                                                    e.target.src = '';
                                                    e.target.alt = 'Image failed to load';
                                                    e.target.className = 'w-full h-32 object-contain bg-neutral-100 text-neutral-400 text-xs flex items-center justify-center';
                                                }}
                                            />
                                        </div>
                                    )}
                                    {!getDocumentUrl(selectedApplication, 'identity_front') && 
                                     !getDocumentUrl(selectedApplication, 'identity_back') && (
                                        <div className="col-span-2 text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded">
                                            No identity documents uploaded
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Business Documents */}
                            {isBusiness(selectedApplication) && (
                                <div className="border-t border-neutral-100 pt-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3">
                                        Business Documents
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {getDocumentUrl(selectedApplication, 'pan_certificate') && (
                                            <div className="border border-neutral-200 rounded overflow-hidden">
                                                <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-200">
                                                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider">PAN Certificate</p>
                                                </div>
                                                <img 
                                                    src={getDocumentUrl(selectedApplication, 'pan_certificate')} 
                                                    alt="PAN Certificate"
                                                    className="w-full h-auto object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '';
                                                        e.target.alt = 'Image failed to load';
                                                        e.target.className = 'w-full h-32 object-contain bg-neutral-100 text-neutral-400 text-xs flex items-center justify-center';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {getDocumentUrl(selectedApplication, 'registration_certificate') && (
                                            <div className="border border-neutral-200 rounded overflow-hidden">
                                                <div className="bg-neutral-50 px-3 py-1.5 border-b border-neutral-200">
                                                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Registration Certificate</p>
                                                </div>
                                                <img 
                                                    src={getDocumentUrl(selectedApplication, 'registration_certificate')} 
                                                    alt="Registration Certificate"
                                                    className="w-full h-auto object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '';
                                                        e.target.alt = 'Image failed to load';
                                                        e.target.className = 'w-full h-32 object-contain bg-neutral-100 text-neutral-400 text-xs flex items-center justify-center';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {!getDocumentUrl(selectedApplication, 'pan_certificate') && 
                                         !getDocumentUrl(selectedApplication, 'registration_certificate') && (
                                            <div className="col-span-2 text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded">
                                                No business documents uploaded
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                                        {selectedApplication.business_registration_number && (
                                            <div>
                                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Registration Number</p>
                                                <p className="font-mono text-sm">{selectedApplication.business_registration_number}</p>
                                            </div>
                                        )}
                                        {selectedApplication.pan_number && (
                                            <div>
                                                <p className="text-[9px] text-neutral-400 uppercase tracking-wider">PAN Number</p>
                                                <p className="font-mono text-sm">{selectedApplication.pan_number}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer with Actions */}
                        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    handleAction(selectedApplication.id, 'approved', true, isBusiness(selectedApplication));
                                    setShowDetailsModal(false);
                                }}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleAction(selectedApplication.id, 'rejected', false, false);
                                    setShowDetailsModal(false);
                                }}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDetailsModal(false)}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSellers;