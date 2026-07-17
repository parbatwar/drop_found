// pages/admin/AdminAnnouncements.jsx
import { useState, useEffect } from 'react';
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../../api/announcement';
import { Icons } from '../../components/Icons'; // ✅ Import from central Icons file

function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ content: '', is_active: true });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await getAllAnnouncements();
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Failed to load announcements:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setSelectedAnnouncement(null);
        setFormData({ content: '', is_active: true });
        setIsModalOpen(true);
    };

    const openEditModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setFormData({ content: announcement.content, is_active: announcement.is_active });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnnouncement(null);
        setFormData({ content: '', is_active: true });
    };

    const handleSave = async () => {
        if (!formData.content.trim()) return;
        try {
            setSaving(true);
            if (selectedAnnouncement) {
                await updateAnnouncement(selectedAnnouncement.id, formData);
            } else {
                await createAnnouncement(formData);
            }
            closeModal();
            await fetchAnnouncements();
        } catch (err) {
            console.error('Failed to save announcement:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (announcement) => {
        if (!confirm(`Delete this announcement?`)) return;
        try {
            await deleteAnnouncement(announcement.id);
            await fetchAnnouncements();
        } catch (err) {
            console.error('Failed to delete announcement:', err);
        }
    };

    const handleToggleStatus = async (announcement) => {
        try {
            await updateAnnouncement(announcement.id, { is_active: !announcement.is_active });
            await fetchAnnouncements();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Announcements...
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
                            <Icons.Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight text-black">
                                Announcements
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Manage promotional banners shown on the website.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300"
                >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    Add Announcement
                </button>
            </div>

            {/* Announcements List */}
            <div className="bg-white border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                        <tr className="text-left">
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Content
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Status
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                                Order
                            </th>
                            <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {announcements.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-16 text-neutral-400 text-sm">
                                    No announcements found.
                                </td>
                            </tr>
                        ) : (
                            announcements.map((announcement) => (
                                <tr key={announcement.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-neutral-800">
                                            {announcement.content}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(announcement)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded transition-colors ${
                                                announcement.is_active
                                                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                    : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:bg-neutral-100'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${announcement.is_active ? 'bg-green-500' : 'bg-neutral-400'}`} />
                                            {announcement.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-neutral-400">
                                            {announcement.display_order || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(announcement)}
                                                className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Icons.Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(announcement)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0" onClick={closeModal} />
                    <div className="relative bg-white w-full max-w-md border border-neutral-100 shadow-lg">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                            <div>
                                <h2 className="text-lg font-light tracking-tight text-black">
                                    {selectedAnnouncement ? 'Edit Announcement' : 'Add Announcement'}
                                </h2>
                                <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                    {selectedAnnouncement ? 'Update banner content' : 'Create a new promotional banner'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-neutral-400 hover:text-black transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-2">
                                    Announcement Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="e.g., SALE — UP TO 50% OFF"
                                    className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    autoFocus
                                />
                                <p className="text-[9px] text-neutral-400 mt-1.5">
                                    This text will appear in the announcement banner.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                                    Active
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                                        formData.is_active ? 'bg-black' : 'bg-neutral-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                            formData.is_active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                                <span className="text-sm text-neutral-600">
                                    {formData.is_active ? 'Visible on site' : 'Hidden from site'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-5 border-t border-neutral-100 bg-neutral-50/50">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || !formData.content.trim()}
                                className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : selectedAnnouncement ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Count */}
            <div className="mt-4 text-[9px] text-neutral-400 uppercase tracking-wider">
                {announcements.length} Announcements
            </div>
        </div>
    );
}

export default AdminAnnouncements;