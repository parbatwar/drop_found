// frontend/src/components/common/EmptyState.jsx
import { Link } from 'react-router-dom';

function EmptyState({ 
    icon, 
    title, 
    subtitle, 
    actionLabel, 
    actionLink, 
    onAction,
    className = '',
}) {
    return (
        <div className={`border border-neutral-200 bg-neutral-50 p-12 md:p-16 text-center ${className}`}>
            {icon && (
                <div className="text-4xl font-light text-neutral-300 mb-4">
                    {icon}
                </div>
            )}
            {title && (
                <p className="text-sm text-neutral-400 uppercase tracking-wider">
                    {title}
                </p>
            )}
            {subtitle && (
                <p className="text-[10px] text-neutral-300 mt-1.5">
                    {subtitle}
                </p>
            )}
            {(actionLabel && (actionLink || onAction)) && (
                <div className="mt-6">
                    {actionLink ? (
                        <Link
                            to={actionLink}
                            className="inline-block border border-black px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            {actionLabel}
                        </Link>
                    ) : (
                        <button
                            onClick={onAction}
                            className="inline-block border border-black px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default EmptyState;