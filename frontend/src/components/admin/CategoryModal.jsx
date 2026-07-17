// components/admin/CategoryModal.jsx
import { useEffect, useState } from "react";

// SVG Icons
const Icons = {
    X: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Tag: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
};

function CategoryModal({
    isOpen,
    onClose,
    onSave,
    category = null,
    loading = false,
}) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [category, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSave({ name: name.trim() });
    };

    if (!isOpen) return null;

    const slug = name.trim() 
        ? name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : "";

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-md border border-neutral-100 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                            <Icons.Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-light tracking-tight text-black">
                                {category ? "Edit Category" : "Add Category"}
                            </h2>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                {category ? "Update category details" : "Create a new category"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-black transition-colors"
                    >
                        <Icons.X />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Body */}
                    <div className="px-6 py-6 space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. T-Shirts"
                                className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                autoFocus
                            />
                        </div>

                        {name && (
                            <div className="bg-neutral-50 border border-neutral-100 px-4 py-3">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
                                    Slug Preview
                                </p>
                                <p className="text-sm text-neutral-600 font-mono">
                                    /categories/{slug}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-5 border-t border-neutral-100 bg-neutral-50/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {loading 
                                ? "Saving..." 
                                : category 
                                    ? "Update" 
                                    : "Create"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryModal;