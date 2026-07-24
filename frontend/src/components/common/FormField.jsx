export function FormField({ label, required, children, className = '' }) {
    return (
        <div className={className}>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                {label} {required && <span className="text-neutral-300">*</span>}
            </label>
            {children}
        </div>
    );
}