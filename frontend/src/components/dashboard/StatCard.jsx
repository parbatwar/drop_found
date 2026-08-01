// components/dashboard/StatCard.jsx
function StatCard({ value, label }) {
    return (
        <div className="bg-white p-6">
            <p className="text-2xl md:text-3xl font-light">{value}</p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
}

export default StatCard;