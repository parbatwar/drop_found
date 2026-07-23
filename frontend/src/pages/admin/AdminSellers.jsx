// frontend/src/pages/admin/AdminSellers.jsx
import { useEffect, useState } from 'react';
import { getPendingSellers, reviewSeller, getSellers } from '../../api/seller';
import AdminTable from '../../components/admin/AdminTable';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminStatsBar from '../../components/admin/AdminStatsBar';
import DocumentViewerModal from '../../components/admin/DocumentViewerModal';
import { Icons } from '../../components/Icons';

function AdminSellers() {
    const [allSellers, setAllSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionId, setActionId] = useState(null);

    // Filters state
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        sellerType: 'all',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        setLoading(true);
        setError('');
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                getPendingSellers(),
                getSellers()
            ]);
            
            const pending = pendingRes.data || [];
            const approved = approvedRes.data || [];
            
            const all = [
                ...pending.map(s => ({ ...s, status: 'pending' })),
                ...approved.map(s => ({ ...s, status: 'approved' }))
            ];
            
            setAllSellers(all);
        } catch (err) {
            console.error("Failed fetching sellers:", err);
            setError(err.response?.data?.detail || "Could not load sellers.");
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
            await fetchSellers();
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
        
        const directMap = {
            'identity_front': app.identity_front_url,
            'identity_back': app.identity_back_url,
            'pan_certificate': app.pan_certificate_url,
            'registration_certificate': app.registration_certificate_url,
        };
        
        if (directMap[docType]) {
            return directMap[docType];
        }
        
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

    const hasDocuments = (app) => {
        const docTypes = ['identity_front', 'identity_back', 'pan_certificate', 'registration_certificate'];
        return docTypes.some(type => getDocumentUrl(app, type));
    };

    // Filter logic
    const getFilteredSellers = () => {
        let filtered = allSellers;
        
        // Normalize filter values
        const statusFilter = filters.status || 'all';
        const typeFilter = filters.type || 'all';
        const sellerTypeFilter = filters.sellerType || 'all';
        
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => {
                const status = (s.verification_status || s.status || '').toLowerCase();
                return status === statusFilter.toLowerCase();
            });
        }
        
        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(s => {
                const isBiz = isBusiness(s);
                return typeFilter === 'business' ? isBiz : !isBiz;
            });
        }
        
        // Seller Type filter
        if (sellerTypeFilter !== 'all') {
            filtered = filtered.filter(s => {
                const sellerType = (s.seller_type || '').toLowerCase();
                return sellerType === sellerTypeFilter.toLowerCase();
            });
        }
        
        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s => 
                s.shop_name?.toLowerCase().includes(query) ||
                s.business_phone?.includes(query) ||
                s.business_email?.toLowerCase().includes(query) ||
                s.location?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    };
    
    const filteredSellers = getFilteredSellers();

    // Stats
    const stats = {
        total: allSellers.length,
        pending: allSellers.filter(s => s.verification_status === 'pending' || s.status === 'pending').length,
        approved: allSellers.filter(s => s.verification_status === 'approved' || s.status === 'approved').length,
        business: allSellers.filter(s => isBusiness(s)).length,
        individual: allSellers.filter(s => !isBusiness(s)).length,
    };

    // Status badge
    const StatusBadge = ({ status }) => {
        const configs = {
            pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
            approved: { label: 'Approved', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        };
        const config = configs[status] || configs.pending;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text', 'bg')}`} />
                {config.label}
            </span>
        );
    };

    // Column definitions
    const columns = [
        {
            key: 'shop',
            label: 'Shop',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-neutral-500 flex-shrink-0">
                        {getInitials(row.shop_name)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-800">{row.shop_name}</p>
                        <p className="text-[9px] text-neutral-400">{row.seller_type || 'N/A'}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (row) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-full ${
                    isBusiness(row) 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                }`}>
                    {isBusiness(row) ? 'Business' : 'Individual'}
                </span>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            className: 'hidden md:table-cell',
            render: (row) => (
                <div>
                    {row.business_phone && <p className="text-sm text-neutral-600">{row.business_phone}</p>}
                    {row.business_email && <p className="text-xs text-neutral-400 truncate max-w-[150px]">{row.business_email}</p>}
                </div>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            className: 'hidden lg:table-cell',
            render: (row) => <span className="text-sm text-neutral-500">{row.location || '—'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => <StatusBadge status={row.verification_status || row.status} />,
        },
        {
            key: 'documents',
            label: 'Documents',
            render: (row) => {
                const hasDocs = hasDocuments(row);
                return hasDocs ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSeller(row);
                            setShowDetailsModal(true);
                        }}
                        className="text-[9px] text-blue-600 hover:text-blue-800 underline transition-colors flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </button>
                ) : (
                    <span className="text-[9px] text-neutral-400">No docs</span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (row) => {
                const isPending = row.verification_status === 'pending' || row.status === 'pending';
                return (
                    <div className="flex justify-end gap-2 flex-wrap">
                        {isPending ? (
                            <>
                                <button
                                    disabled={actionId !== null}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction(row.id, 'approved', true, isBusiness(row));
                                    }}
                                    className="px-3 py-1 bg-black text-white text-[9px] uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    disabled={actionId !== null}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction(row.id, 'rejected', false, false);
                                    }}
                                    className="px-3 py-1 border border-red-300 text-red-500 text-[9px] uppercase tracking-wider hover:bg-red-50 transition-colors disabled:border-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed rounded"
                                >
                                    Reject
                                </button>
                            </>
                        ) : (
                            <span className="text-[9px] text-green-600 uppercase tracking-wider">
                                Approved
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    // ✅ Filter definitions (rejected removed from options)
    const filterDefinitions = [
        {
            key: 'status',
            label: 'Status',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
            ],
        },
        {
            key: 'type',
            label: 'Type',
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'All Types' },
                { value: 'individual', label: 'Individual' },
                { value: 'business', label: 'Business' },
            ],
        },
        {
            key: 'sellerType',
            label: 'Category',
            defaultValue: 'all',  // ✅ Make sure this is set
            options: [
                { value: 'all', label: 'All Categories' },
                { value: 'thrift', label: 'Thrift' },
                { value: 'retailer', label: 'Retailer' },
            ],
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Sellers...
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div>
                    <h1 className="text-2xl font-light tracking-tight text-black">
                        Seller Management
                    </h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Manage all seller applications and their verification status.
                    </p>
                </div>
            </div>

            {/* Stats Bar */}
            <AdminStatsBar stats={stats} className="mb-4" />

            {/* Status Messages */}
            {error && (
                <div className="mb-4 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-4 bg-green-50 border-l-2 border-green-400 px-4 py-3 text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            {/* Filters */}
            <AdminFilters
                filters={filterDefinitions}
                onFilterChange={(newFilters) => setFilters(newFilters)}
                onSearch={(query) => setSearchQuery(query)}
                onClear={() => {
                    setFilters({ status: 'all', type: 'all', sellerType: 'all' });
                    setSearchQuery('');
                }}
                searchPlaceholder="Search by shop name, phone, email..."
                className="mb-6"
            />

            {/* Table */}
            <AdminTable
                columns={columns}
                data={filteredSellers}
                emptyMessage="No sellers found. Try adjusting your filters."
            />

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-[9px] text-neutral-400 uppercase tracking-wider">
                <span>{filteredSellers.length} sellers found</span>
            </div>

            {/* Document Modal */}
            <DocumentViewerModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                seller={selectedSeller}
                getDocumentUrl={getDocumentUrl}
                isBusiness={isBusiness}
                onApprove={(id) => {
                    handleAction(id, 'approved', true, isBusiness(selectedSeller));
                    setShowDetailsModal(false);
                }}
                onReject={(id) => {
                    handleAction(id, 'rejected', false, false);
                    setShowDetailsModal(false);
                }}
            />
        </div>
    );
}

export default AdminSellers;