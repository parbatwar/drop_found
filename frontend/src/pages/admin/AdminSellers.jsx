// pages/admin/AdminSellers.jsx - Refactored Version
import { useAdminSellers } from '../../hooks/useAdminSellers';
import AdminTable from '../../components/admin/AdminTable';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminStatsBar from '../../components/admin/AdminStatsBar';
import DocumentViewerModal from '../../components/admin/DocumentViewerModal';
import SellerTableRow from '../../components/admin/SellerTableRow';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function AdminSellers() {
    const {
        loading,
        error,
        successMessage,
        selectedSeller,
        showDetailsModal,
        actionId,
        filters,
        searchQuery,
        setFilters,
        setSearchQuery,
        setSelectedSeller,
        setShowDetailsModal,
        handleAction,
        isBusiness,
        getDocumentUrl,
        hasDocuments,
        getFilteredSellers,
        getStats,
        getInitials,
    } = useAdminSellers();

    if (loading) {
        return <LoadingSpinner message="Loading Sellers..." />;
    }

    const filteredSellers = getFilteredSellers();
    const stats = getStats();

    // Column definitions for AdminTable
    const columns = [
        { key: 'shop', label: 'Shop', render: (row) => null }, // Rendered by SellerTableRow
        { key: 'type', label: 'Type', render: (row) => null },
        { key: 'contact', label: 'Contact', className: 'hidden md:table-cell' },
        { key: 'location', label: 'Location', className: 'hidden lg:table-cell' },
        { key: 'status', label: 'Status' },
        { key: 'documents', label: 'Documents' },
        { key: 'actions', label: 'Actions', className: 'text-right' },
    ];

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
            defaultValue: 'all',
            options: [
                { value: 'all', label: 'All Categories' },
                { value: 'thrift', label: 'Thrift' },
                { value: 'retailer', label: 'Retailer' },
            ],
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div>
                    <h1 className="text-2xl font-light tracking-tight text-black">Seller Management</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">Manage all seller applications and their verification status.</p>
                </div>
            </div>

            {/* Stats Bar */}
            <AdminStatsBar stats={stats} className="mb-4" />

            {/* Status Messages */}
            {error && (
                <div className="mb-4 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">{error}</div>
            )}
            {successMessage && (
                <div className="mb-4 bg-green-50 border-l-2 border-green-400 px-4 py-3 text-sm text-green-600">{successMessage}</div>
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
            <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Shop</th>
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Type</th>
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium hidden md:table-cell">Contact</th>
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium hidden lg:table-cell">Location</th>
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Documents</th>
                            <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredSellers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-neutral-400 text-sm">
                                    No sellers found. Try adjusting your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredSellers.map((seller) => (
                                <SellerTableRow
                                    key={seller.id}
                                    seller={seller}
                                    isBusiness={isBusiness}
                                    getInitials={getInitials}
                                    hasDocuments={hasDocuments}
                                    onViewDocuments={(seller) => {
                                        setSelectedSeller(seller);
                                        setShowDetailsModal(true);
                                    }}
                                    onApprove={(id, isBiz) => handleAction(id, 'approved', true, isBiz)}
                                    onReject={(id) => handleAction(id, 'rejected', false, false)}
                                    actionId={actionId}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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