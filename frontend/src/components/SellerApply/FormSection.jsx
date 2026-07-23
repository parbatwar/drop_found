// frontend/src/components/SellerApply/FormSection.jsx
function FormSection({ title, children, className = '' }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {title && (
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}

export default FormSection;