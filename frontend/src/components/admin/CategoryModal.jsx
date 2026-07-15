import { useEffect, useState } from "react";

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

        await onSave({
            name: name.trim(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

                {/* Header */}
                <div className="px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">
                        {category ? "Edit Category" : "Add Category"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Body */}
                    <div className="p-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. T-Shirts"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                        />

                        {name && (
                            <p className="mt-3 text-sm text-gray-500">
                                Slug:
                                {" "}
                                {name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}
                            </p>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-5 border-t">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : category
                                    ? "Update"
                                    : "Create"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CategoryModal;