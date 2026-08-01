// components/admin/SellerTableRow.jsx
import StatusBadge from '../common/StatusBadge';

function SellerTableRow({ 
    seller, 
    isBusiness, 
    getInitials, 
    hasDocuments, 
    onViewDocuments, 
    onApprove, 
    onReject, 
    actionId 
}) {
    const isPending = seller.verification_status === 'pending' || seller.status === 'pending';

    return (
        <tr className="hover:bg-neutral-50 transition-colors">
            {/* Shop */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-medium text-neutral-500 flex-shrink-0">
                        {getInitials(seller.shop_name)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-800">{seller.shop_name}</p>
                        <p className="text-[9px] text-neutral-400">{seller.seller_type || 'N/A'}</p>
                    </div>
                </div>
            </td>

            {/* Type */}
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-full ${
                    isBusiness(seller) 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                }`}>
                    {isBusiness(seller) ? 'Business' : 'Individual'}
                </span>
            </td>

            {/* Contact */}
            <td className="px-4 py-3 hidden md:table-cell">
                <div>
                    {seller.business_phone && <p className="text-sm text-neutral-600">{seller.business_phone}</p>}
                    {seller.business_email && <p className="text-xs text-neutral-400 truncate max-w-[150px]">{seller.business_email}</p>}
                </div>
            </td>

            {/* Location */}
            <td className="px-4 py-3 hidden lg:table-cell">
                <span className="text-sm text-neutral-500">{seller.location || '—'}</span>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <StatusBadge status={seller.verification_status || seller.status} />
            </td>

            {/* Documents */}
            <td className="px-4 py-3">
                {hasDocuments(seller) ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDocuments(seller);
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
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                    {isPending ? (
                        <>
                            <button
                                disabled={actionId !== null}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onApprove(seller.id, isBusiness(seller));
                                }}
                                className="px-3 py-1 bg-black text-white text-[9px] uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed rounded"
                            >
                                Approve
                            </button>
                            <button
                                disabled={actionId !== null}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReject(seller.id);
                                }}
                                className="px-3 py-1 border border-red-300 text-red-500 text-[9px] uppercase tracking-wider hover:bg-red-50 transition-colors disabled:border-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed rounded"
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <span className="text-[9px] text-green-600 uppercase tracking-wider">✓ Approved</span>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default SellerTableRow;