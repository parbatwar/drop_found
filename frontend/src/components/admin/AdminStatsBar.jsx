// frontend/src/components/admin/AdminStatsBar.jsx
function AdminStatsBar({ stats, className = '' }) {
    if (!stats || Object.keys(stats).length === 0) return null;

    const items = Object.entries(stats).map(([key, value]) => {
        const colors = {
            total: { dot: 'bg-neutral-400', label: 'Total' },
            pending: { dot: 'bg-amber-500', label: 'Pending' },
            approved: { dot: 'bg-green-500', label: 'Approved' },
            rejected: { dot: 'bg-red-500', label: 'Rejected' },
            business: { dot: 'bg-blue-500', label: 'Business' },
            individual: { dot: 'bg-green-500', label: 'Individual' },
        };
        const config = colors[key] || { dot: 'bg-neutral-400', label: key };
        
        return (
            <div key={key} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-neutral-400 text-xs">{config.label}:</span>
                <span className="font-medium text-sm">{value}</span>
            </div>
        );
    });

    return (
        <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
            {items}
        </div>
    );
}

export default AdminStatsBar;