import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
} from "../../api/category";

import CategoryModal from "../../components/admin/CategoryModal";


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
                await updateCategory(
                    selectedCategory.id,
                    data
                );
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


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">
                    Loading categories...
                </p>
            </div>
        );
    }


    return (
        <div className="max-w-7xl mx-auto px-6 py-8">


            {/* Header */}
            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Categories
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage product categories available to sellers.
                    </p>
                </div>


                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    Add Category
                </button>

            </div>



            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-50 border-b">

                        <tr className="text-left text-sm font-semibold text-gray-600">

                            <th className="px-6 py-4">
                                Name
                            </th>

                            <th className="px-6 py-4">
                                Slug
                            </th>

                            <th className="px-6 py-4">
                                Status
                            </th>

                            <th className="px-6 py-4 text-right">
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {categories.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-16 text-gray-500"
                                >
                                    No categories found.
                                </td>
                            </tr>


                        ) : (

                            categories.map((category) => (

                                <tr
                                    key={category.id}
                                    className="border-b last:border-b-0 hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {category.name}
                                    </td>


                                    <td className="px-6 py-4 text-gray-500">
                                        {category.slug}
                                    </td>


                                    <td className="px-6 py-4">

                                        {category.is_active ? (

                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                                Active
                                            </span>

                                        ) : (

                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                                Inactive
                                            </span>

                                        )}

                                    </td>


                                    <td className="px-6 py-4">

                                        <div className="flex justify-end">

                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                            </button>

                                        </div>

                                    </td>


                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>



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