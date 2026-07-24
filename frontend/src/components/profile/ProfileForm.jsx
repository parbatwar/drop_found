// components/profile/ProfileForm.jsx
import { useState } from 'react';

function ProfileForm({ user, formData, onChange, onSave, onCancel, saving, isEditing }) {
    if (!isEditing) {
        return (
            <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">First Name</p>
                        <p className="text-sm text-neutral-700">{user?.first_name || '-'}</p>
                    </div>
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">Last Name</p>
                        <p className="text-sm text-neutral-700">{user?.last_name || '-'}</p>
                    </div>
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">Email</p>
                        <p className="text-sm text-neutral-700">{user?.email}</p>
                    </div>
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">Phone</p>
                        <p className="text-sm text-neutral-700">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">Role</p>
                        <p className="text-sm text-neutral-700 capitalize">{user?.role || 'Buyer'}</p>
                    </div>
                    <div className="border-b border-neutral-100 pb-4">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">Email Verified</p>
                        <p className="text-sm text-neutral-700 flex items-center gap-2">
                            {user?.is_email_verified ? (
                                <>
                                    <span className="text-green-600">Yes</span>
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            ) : (
                                <span className="text-amber-600">No</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSave} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={onChange}
                        className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                        placeholder="First name"
                    />
                </div>
                <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={onChange}
                        className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                        placeholder="Last name"
                    />
                </div>
                <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        className="w-full border-b border-neutral-200 px-0 py-2.5 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                        placeholder="Phone number"
                    />
                </div>
                <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                        Email
                    </label>
                    <p className="text-sm text-neutral-400 py-2.5 border-b border-neutral-100">
                        {user?.email}
                    </p>
                </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-neutral-200 px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export default ProfileForm;