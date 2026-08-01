export function ToggleSwitch({ value, onChange, label, description, activeColor = 'bg-black' }) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${value ? activeColor : 'bg-neutral-300'}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div>
                <span className="text-sm font-medium text-neutral-700">{label}</span>
                {description && <p className="text-[9px] text-neutral-400">{description}</p>}
            </div>
        </div>
    );
}