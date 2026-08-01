// frontend/src/components/common/StatusBadge.jsx
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants/orderStatus';

function StatusBadge({ status, className = '', size = 'sm' }) {
    const config = ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.pending;
    const label = ORDER_STATUS_LABELS[status] || status || 'Unknown';
    
    const sizeClasses = {
        sm: 'px-2.5 py-0.5 text-[9px]',
        md: 'px-3 py-1 text-[10px]',
        lg: 'px-4 py-1.5 text-[11px]',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 font-medium uppercase tracking-wider rounded-full border ${config} ${sizeClasses[size] || sizeClasses.sm} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'pending' ? 'bg-amber-500 animate-pulse' :
                status === 'approved' ? 'bg-green-500' :
                status === 'rejected' ? 'bg-red-500' :
                status === 'completed' ? 'bg-emerald-500' :
                'bg-current'
            }`} />
            {label}
        </span>
    );
}

export default StatusBadge;