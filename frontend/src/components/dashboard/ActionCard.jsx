// components/dashboard/ActionCard.jsx
import { Link } from 'react-router-dom';
import { Icons } from '../Icons';

function ActionCard({ to, icon: Icon, label, comingSoon = false }) {
    if (comingSoon) {
        return (
            <div className="border border-neutral-200 px-6 py-4 bg-neutral-50 cursor-not-allowed opacity-60">
                <div className="flex items-center gap-3">
                    <div className="text-neutral-300">
                        <Icon />
                    </div>
                    <span className="text-sm text-neutral-400">{label}</span>
                </div>
                <span className="text-[9px] text-neutral-300 uppercase tracking-wider mt-1 block">Coming Soon</span>
            </div>
        );
    }

    return (
        <Link
            to={to}
            className="flex items-center justify-between border border-neutral-200 px-6 py-4 hover:border-black hover:bg-black group transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                <div className="text-neutral-400 group-hover:text-white transition-colors">
                    <Icon />
                </div>
                <span className="text-sm text-neutral-600 group-hover:text-white transition-colors">
                    {label}
                </span>
            </div>
            <Icons.ArrowRight className="text-neutral-400 group-hover:text-white transition-colors" />
        </Link>
    );
}

export default ActionCard;