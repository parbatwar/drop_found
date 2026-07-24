// hooks/useAdminSellers.js
import { useState, useEffect } from 'react';
import { getPendingSellers, reviewSeller, getSellers } from '../api/seller';
import { useToast } from './useToast';

export const useAdminSellers = () => {
    const { showToast } = useToast();
    const [allSellers, setAllSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        sellerType: 'all',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        setLoading(true);
        setError('');
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                getPendingSellers(),
                getSellers()
            ]);
            
            const pending = pendingRes.data || [];
            const approved = approvedRes.data || [];
            
            const all = [
                ...pending.map(s => ({ ...s, status: 'pending' })),
                ...approved.map(s => ({ ...s, status: 'approved' }))
            ];
            
            setAllSellers(all);
        } catch (err) {
            console.error("Failed fetching sellers:", err);
            setError(err.response?.data?.detail || "Could not load sellers.");
            showToast('Failed to load sellers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status, verifyIdentity = false, verifyBusiness = false) => {
        setError('');
        setSuccessMessage('');
        setActionId(id);

        try {
            await reviewSeller(id, {
                status: status,
                verify_identity: verifyIdentity,
                verify_business: verifyBusiness,
            });
            const msg = `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully.`;
            setSuccessMessage(msg);
            showToast(msg, 'success');
            await fetchSellers();
        } catch (err) {
            console.error(`Action failed for ID ${id}:`, err);
            const msg = err.response?.data?.detail || "Failed to process application.";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setActionId(null);
        }
    };

    const isBusiness = (app) => {
        return app.business_type === 'registered' || app.applied_as_business === true;
    };

    const getDocumentUrl = (app, docType) => {
        if (!app) return null;
        
        const directMap = {
            'identity_front': app.identity_front_url,
            'identity_back': app.identity_back_url,
            'pan_certificate': app.pan_certificate_url,
            'registration_certificate': app.registration_certificate_url,
        };
        
        if (directMap[docType]) {
            return directMap[docType];
        }
        
        if (app.verification_documents) {
            const altKeys = {
                'identity_front': ['identity_front', 'identity_front_url', 'front_id'],
                'identity_back': ['identity_back', 'identity_back_url', 'back_id'],
                'pan_certificate': ['pan_certificate', 'pan_certificate_url', 'pan'],
                'registration_certificate': ['registration_certificate', 'registration_certificate_url', 'registration'],
            };
            const keys = altKeys[docType] || [docType];
            for (const key of keys) {
                if (app.verification_documents[key]) {
                    return app.verification_documents[key];
                }
            }
        }
        
        return null;
    };

    const hasDocuments = (app) => {
        const docTypes = ['identity_front', 'identity_back', 'pan_certificate', 'registration_certificate'];
        return docTypes.some(type => getDocumentUrl(app, type));
    };

    const getFilteredSellers = () => {
        let filtered = allSellers;
        
        const statusFilter = filters.status || 'all';
        const typeFilter = filters.type || 'all';
        const sellerTypeFilter = filters.sellerType || 'all';
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => {
                const status = (s.verification_status || s.status || '').toLowerCase();
                return status === statusFilter.toLowerCase();
            });
        }
        
        if (typeFilter !== 'all') {
            filtered = filtered.filter(s => {
                const isBiz = isBusiness(s);
                return typeFilter === 'business' ? isBiz : !isBiz;
            });
        }
        
        if (sellerTypeFilter !== 'all') {
            filtered = filtered.filter(s => {
                const sellerType = (s.seller_type || '').toLowerCase();
                return sellerType === sellerTypeFilter.toLowerCase();
            });
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s => 
                s.shop_name?.toLowerCase().includes(query) ||
                s.business_phone?.includes(query) ||
                s.business_email?.toLowerCase().includes(query) ||
                s.location?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    };

    const getStats = () => {
        return {
            total: allSellers.length,
            pending: allSellers.filter(s => s.verification_status === 'pending' || s.status === 'pending').length,
            approved: allSellers.filter(s => s.verification_status === 'approved' || s.status === 'approved').length,
            business: allSellers.filter(s => isBusiness(s)).length,
            individual: allSellers.filter(s => !isBusiness(s)).length,
        };
    };

    const getInitials = (shopName) => {
        if (!shopName) return '?';
        const words = shopName.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    return {
        allSellers,
        loading,
        error,
        successMessage,
        selectedSeller,
        showDetailsModal,
        actionId,
        filters,
        searchQuery,
        setFilters,
        setSearchQuery,
        setSelectedSeller,
        setShowDetailsModal,
        fetchSellers,
        handleAction,
        isBusiness,
        getDocumentUrl,
        hasDocuments,
        getFilteredSellers,
        getStats,
        getInitials,
    };
};