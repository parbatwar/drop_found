// src/pages/admin/AdminSellers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingSellers, reviewSellerApplication } from '../../api/admin';

function AdminSellers() {
    const navigate = useNavigate();
    
    // Core application context states
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null); // Tracks processing item for visual disabled flags
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch waiting applications on layout mount
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getPendingSellers();
            // Fallback assertion ensuring array consistency
            setApplications(res.data || []);
        } catch (err) {
            console.error("Failed fetching application payload:", err);
            setError(err.response?.data?.detail || "Could not synchronize admin payload safely.");
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
            
            setSuccessMessage(`Application effectively marked as ${status === 'approved' ? 'approved' : 'rejected'}.`);
            setApplications((prev) => prev.filter((app) => app.id !== id));
        } catch (err) {
            console.error(`Application classification failure tracking ID ${id}:`, err);
            setError(err.response?.data?.detail || "Failed to commit decision statement updates.");
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Synchronizing Registry Ledger...
                </div>
            </div>
        );
    }

    return (
            <div className="p-6 md:p-10 max-w-5xl mx-auto">
                
                {/* Header Layout */}
                <div className="space-y-3 mb-12 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                        Control Center / Core Management
                    </span>
                    <h1 className="text-3xl font-light tracking-[0.08em] text-black uppercase">
                        Pending Merchant Registries
                    </h1>
                </div>

                {/* Status Banners */}
                {error && (
                    <div className="bg-neutral-50 border-l-2 border-black text-neutral-800 px-4 py-3 text-xs tracking-wide mb-6 uppercase">
                        <span className="font-medium text-black">Error:</span> {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-neutral-50 border-l-2 border-emerald-600 text-neutral-800 px-4 py-3 text-xs tracking-wide mb-6 uppercase">
                        <span className="font-medium text-emerald-600">Success:</span> {successMessage}
                    </div>
                )}

                {/* Main Queue Management List Block */}
                {applications.length === 0 ? (
                    <div className="border border-dashed border-neutral-200 py-20 text-center bg-neutral-50 rounded-sm">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">
                            Clear Ledger — No Pending Applications Exist.
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div 
                                key={app.id} 
                                className="border border-neutral-100 p-6 bg-white rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-neutral-200 transition-colors duration-200"
                            >
                                {/* Application Information */}
                                <div className="space-y-2 max-w-xl">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-sm font-medium tracking-wide text-black uppercase">
                                            {app.shop_name}
                                        </h3>
                                        <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm font-medium">
                                            {app.seller_type}
                                        </span>
                                        {app.location && (
                                            <span className="text-[9px] tracking-wide text-neutral-400 font-light">
                                                • {app.location}
                                            </span>
                                        )}
                                    </div>
                                    {app.bio ? (
                                        <p className="text-xs text-neutral-500 font-light leading-relaxed tracking-wide">
                                            {app.bio}
                                        </p>
                                    ) : (
                                        <p className="text-xs italic text-neutral-300 tracking-wide font-light">
                                            No business presentation bio declared.
                                        </p>
                                    )}
                                    <div className="text-[9px] tracking-wider text-neutral-400 uppercase pt-1">
                                        Applicant ID Reference: <span className="font-mono text-neutral-600">#{app.user_id}</span>
                                    </div>
                                </div>

                                {/* Controls Button Panel */}
                                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-neutral-50 pt-4 md:pt-0">
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'approved')}
                                        className="flex-1 md:flex-initial bg-black text-white px-5 py-2 text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-200 disabled:bg-neutral-100 disabled:text-neutral-300 rounded-sm"
                                    >
                                        {actionId === app.id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={actionId !== null}
                                        onClick={() => handleAction(app.id, 'rejected')}
                                        className="flex-1 md:flex-initial border border-neutral-200 text-neutral-600 px-5 py-2 text-[10px] tracking-widest uppercase hover:border-black hover:text-black transition-colors duration-200 disabled:border-neutral-100 disabled:text-neutral-300 rounded-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
}

export default AdminSellers;