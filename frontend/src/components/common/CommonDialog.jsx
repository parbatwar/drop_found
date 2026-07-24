// frontend/src/components/common/ConfirmDialog.jsx
import Modal from './Modal';

function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'danger', // 'danger' | 'primary' | 'neutral'
    loading = false,
}) {
    const variantClasses = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        primary: 'bg-black hover:bg-neutral-800 text-white',
        neutral: 'border border-neutral-300 hover:border-black text-neutral-700 hover:text-black',
    };

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-6">
                <p className="text-sm text-neutral-600 leading-relaxed">
                    {message}
                </p>
                
                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[confirmVariant] || variantClasses.primary}`}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;