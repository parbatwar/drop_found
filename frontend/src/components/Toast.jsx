// components/Toast.jsx
import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const styles = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-400',
            text: 'text-blue-700',
            icon: 'ℹ️'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-400',
            text: 'text-green-700',
            icon: '✅'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-400',
            text: 'text-yellow-700',
            icon: '⚠️'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-400',
            text: 'text-red-700',
            icon: '❌'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-slideDown">
            <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded shadow-lg`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0 text-lg">
                        {style.icon}
                    </div>
                    <div className="ml-3">
                        <p className={`text-sm ${style.text}`}>
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose();
                        }}
                        className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;