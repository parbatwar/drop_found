// pages/admin/Categories.jsx
import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../api/category";
import CategoryModal from "../../components/admin/CategoryModal";

// SVG Icons
const Icons = {
    Plus: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
    ),
    Edit: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Trash: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Categories: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
};

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleSave = async (data) => {
        try {
            setSaving(true);
            if (selectedCategory) {
                await updateCategory(selectedCategory.id, data);
            } else {
                await createCategory(data);
            }
            closeModal();
            await fetchCategories();
        } catch (err) {
            console.error("Category save failed", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!confirm(`Delete "${category.name}"? This action cannot be undone.`)) return;
        try {
            await deleteCategory(category.id);
            await fetchCategories();
        } catch (err) {
            console.error("Failed to delete category", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Categories...
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                            <Icons.Categories className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight text-black">
                                Categories
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Manage product categories available to sellers.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300"
                >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    Add Category
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                        <tr className="text-left">
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Name
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Slug
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Status
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-16 text-neutral-400 text-sm">
                                    No categories found.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-neutral-800">
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-neutral-400 font-mono">
                                            {category.slug}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded ${
                                            category.is_active
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
                                        }`}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Icons.Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Count */}
            <div className="mt-4 text-[9px] text-neutral-400 uppercase tracking-wider">
                {categories.length} Categories
            </div>

            {/* Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                category={selectedCategory}
                loading={saving}
            />
        </div>
    );
}

export default Categories;