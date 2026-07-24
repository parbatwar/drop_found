// frontend/src/components/common/Modal.jsx
import { useEffect, useRef } from 'react';
import { Icons } from '../Icons';

function Modal({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    children, 
    size = 'md',
    showCloseButton = true,
    className = '',
}) {
    const modalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        full: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div 
                ref={modalRef}
                className={`relative bg-white w-full ${sizeClasses[size] || sizeClasses.md} shadow-xl ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                        <div>
                            {title && (
                                <h2 id="modal-title" className="text-lg font-light tracking-tight text-black">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-neutral-400 hover:text-black transition-colors flex-shrink-0 ml-4"
                                aria-label="Close modal"
                            >
                                <Icons.X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;