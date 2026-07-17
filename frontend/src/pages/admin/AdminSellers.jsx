// src/pages/admin/AdminSellers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingSellers, reviewSellerApplication } from '../../api/admin';

// SVG Icons
const Icons = {
    Users: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Check: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    X: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Clock: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Location: ({ className = "w-3.5 h-3.5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
};

function AdminSellers() {
    const navigate = useNavigate();
    
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getPendingSellers();
            setApplications(res.data || []);
        } catch (err) {
            console.error("Failed fetching applications:", err);
            setError(err.response?.data?.detail || "Could not load pending applications.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setError('');
        setSuccessMessage('');
        setActionId(id);

        try {
            await reviewSellerApplication(id, status);
            setSuccessMessage(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (err) {
            console.error(`Action failed for ID ${id}:`, err);
            setError(err.response?.data?.detail || "Failed to process application.");
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Applications...
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
                            <Icons.Users className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-light tracking-tight text-black">
                                Pending Sellers
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Review and manage seller applications.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-light text-neutral-300">
                        {applications.length}
                    </span>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                        Pending
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 bg-green-50 border-l-2 border-green-400 px-4 py-3 text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            {/* Applications List */}
            {applications.length === 0 ? (
                <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                    <div className="text-4xl font-light text-neutral-300 mb-3">📋</div>
                    <p className="text-sm text-neutral-400 uppercase tracking-wider">
                        No pending applications
                    </p>
                    <p className="text-[10px] text-neutral-300 mt-1">
                        All seller applications have been reviewed.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div 
                            key={app.id} 
                            className="bg-white border border-neutral-100 p-5 hover:border-neutral-300 transition-colors duration-200"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Application Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
                                        <h3 className="text-base font-light text-neutral-900">
                                            {app.shop_name}
                                        </h3>
                                        <span className="text-[9px] uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                                            {app.seller_type}
                                        </span>
                                        {app.location && (
                                            <span className="text-[9px] text-neutral-400 flex items-center gap-1">
                                                <Icons.Location className="w-3 h-3" />
                                                {app.location}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {app.bio ? (
                                        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                                            {app.bio}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-neutral-300 italic">
                                            No bio provided
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                            Applicant: <span className="text-neutral-600">#{app.user_id?.slice(0, 8)}</span>
                                        </span>
                                        {app.created_at && (
                                            <span className="text-[9px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                                                <Icons.Clock className="w-3 h-3" />
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2.5 flex-shrink-0">
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'approved')}
                                        className="flex items-center gap-1.5 bg-black text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-200 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                    >
                                        <Icons.Check className="w-3.5 h-3.5" />
                                        {actionId === app.id ? '...' : 'Approve'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'rejected')}
                                        className="flex items-center gap-1.5 border border-neutral-200 text-neutral-600 px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:border-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
                                    >
                                        <Icons.X className="w-3.5 h-3.5" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminSellers;