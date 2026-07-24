import { useState, useEffect } from 'react';
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../../api/announcement';
import { Icons } from '../../components/Icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

function AdminAnnouncements() {
    const { showToast } = useToast();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState({ content: '', is_active: true });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await getAllAnnouncements();
            setAnnouncements(res.data || []);
        } catch (err) {
            showToast('Failed to load announcements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item = null) => {
        setSelected(item);
        setForm(item ? { content: item.content, is_active: item.is_active } : { content: '', is_active: true });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelected(null);
        setForm({ content: '', is_active: true });
    };

    const handleSave = async () => {
        if (!form.content.trim()) return;
        setSaving(true);
        try {
            if (selected) {
                await updateAnnouncement(selected.id, form);
                showToast('Announcement updated', 'success');
            } else {
                await createAnnouncement(form);
                showToast('Announcement created', 'success');
            }
            closeModal();
            await fetchAnnouncements();
        } catch (err) {
            showToast('Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteAnnouncement(deleteTarget.id);
            showToast('Announcement deleted', 'success');
            await fetchAnnouncements();
        } catch (err) {
            showToast('Failed to delete', 'error');
        } finally {
            setDeleteTarget(null);
        }
    };

    const toggleStatus = async (item) => {
        try {
            await updateAnnouncement(item.id, { is_active: !item.is_active });
            await fetchAnnouncements();
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) return <LoadingSpinner message="Loading Announcements..." />;

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
                            <h1 className="text-2xl font-light tracking-tight text-black">Announcements</h1>
                            <p className="text-sm text-neutral-500 mt-0.5">Manage promotional banners shown on the website.</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300"
                >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    Add Announcement
                </button>
            </div>

            {/* Table */}
            {announcements.length === 0 ? (
                <EmptyState icon="📢" title="No announcements found" subtitle="Create your first announcement to promote your brand." />
            ) : (
                <div className="bg-white border border-neutral-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr className="text-left">
                                <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Content</th>
                                <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Status</th>
                                <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Order</th>
                                <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {announcements.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4"><span className="text-sm text-neutral-800">{item.content}</span></td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded transition-colors ${
                                                item.is_active
                                                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                    : 'bg-neutral-50 text-neutral-400 border border-neutral-200 hover:bg-neutral-100'
                                            }`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-neutral-400'}`} />
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-neutral-400">{item.display_order || 0}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => openModal(item)} className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded transition-colors" title="Edit">
                                                <Icons.Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4 text-[9px] text-neutral-400 uppercase tracking-wider">{announcements.length} Announcements</div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={selected ? 'Edit Announcement' : 'Add Announcement'} size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-2">Announcement Text</label>
                        <input
                            type="text"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="e.g., SALE — UP TO 50% OFF"
                            className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Active</label>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, is_active: !form.is_active })}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${form.is_active ? 'bg-black' : 'bg-neutral-300'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm text-neutral-600">{form.is_active ? 'Visible on site' : 'Hidden from site'}</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                        <button onClick={closeModal} className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !form.content.trim()}
                            className="px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Announcement"
                message={`Are you sure you want to delete "${deleteTarget?.content}"?`}
                confirmLabel="Delete"
                confirmVariant="danger"
            />
        </div>
    );
}

export default AdminAnnouncements;