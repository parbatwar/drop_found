// components/Toast.jsx - Premium Version (Fixed)
import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 400);
    };

    if (!isVisible) return null;

    const styles = {
        success: {
            border: 'border-green-500',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            text: 'text-neutral-800',
            subText: 'text-neutral-500',
        },
        error: {
            border: 'border-red-500',
            iconBg: 'bg-red-50',
            iconColor: 'text-red-600',
            text: 'text-neutral-800',
            subText: 'text-neutral-500',
        },
        warning: {
            border: 'border-amber-500',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            text: 'text-neutral-800',
            subText: 'text-neutral-500',
        },
        info: {
            border: 'border-blue-500',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            text: 'text-neutral-800',
            subText: 'text-neutral-500',
        },
    };

    const style = styles[type] || styles.info;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'success': return 'Success';
            case 'error': return 'Error';
            case 'warning': return 'Warning';
            default: return 'Info';
        }
    };

    return (
        <div 
            className={`fixed top-6 right-6 z-[9999] w-96 transform transition-all duration-500 ease-out ${
                isExiting 
                    ? 'opacity-0 translate-x-8 scale-95' 
                    : 'opacity-100 translate-x-0 scale-100'
            }`}
            style={{ zIndex: 9999 }}
        >
            <div 
                className={`relative bg-white rounded-xl shadow-2xl border-l-4 ${style.border} overflow-hidden`}
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.05)' }}
            >
                <div className="flex items-start p-4 gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
                        {getIcon()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-semibold ${style.text}`}>
                                {getTitle()}
                            </h4>
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors duration-200 p-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className={`text-sm ${style.subText} mt-0.5 leading-relaxed`}>
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;