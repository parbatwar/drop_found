// components/common/VerificationIcon.jsx
import { useState } from 'react';
import { Icons } from '../Icons';

function VerificationIcon({ type }) {
    const [showTooltip, setShowTooltip] = useState(false);
    
    const getTooltipText = () => {
        if (type === 'individual') return 'Identity Verified';
        if (type === 'business') return 'Business Registered & Verified';
        return 'Verified Seller';
    };
    
    const getIconColor = () => {
        if (type === 'individual') return 'text-green-500';
        if (type === 'business') return 'text-blue-500';
        return 'text-blue-500';
    };
    
    return (
        <div 
            className="relative inline-flex items-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className={getIconColor()} title={getTooltipText()}>
                <Icons.Verified className="w-5 h-5" />
            </span>
            
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-[10px] font-medium rounded whitespace-nowrap z-10 shadow-lg">
                    {getTooltipText()}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                </div>
            )}
        </div>
    );
}

export default VerificationIcon;