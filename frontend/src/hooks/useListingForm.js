// hooks/useListingForm.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, updateListing } from '../api/listings';
import { getMySellerProfile } from '../api/seller';
import { getListingOptions } from '../api/meta';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { useToast } from './useToast';

export const useListingForm = (listingId = null) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const fileInputRef = useRef(null);
    
    const [seller, setSeller] = useState(null);
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantity: 1,
        condition: '',
        category_id: '',
        gender: '',
        size: '',
        status: 'active',
        is_surplus: false,
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const isRetailer = seller?.seller_type === 'retailer';
    const isEdit = !!listingId;

    // Load seller profile and options
    useEffect(() => {
        const loadData = async () => {
            try {
                const [sellerRes, optionsRes] = await Promise.all([
                    getMySellerProfile(),
                    getListingOptions(),
                ]);
                setSeller(sellerRes.data);
                setOptions(optionsRes.data);
            } catch (err) {
                console.error(err);
                setError('Could not load configurations.');
                showToast('Failed to load data', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Load listing data if editing
    useEffect(() => {
        if (isEdit && listingId && !loading) {
            const loadListing = async () => {
                try {
                    const res = await getListing(listingId);
                    const listing = res.data;
                    setFormData({
                        title: listing.title || '',
                        description: listing.description || '',
                        price: listing.price ?? '',
                        quantity: listing.quantity ?? 1,
                        condition: listing.condition || '',
                        category_id: listing.category_id || '',
                        gender: listing.gender || '',
                        size: listing.size || '',
                        status: listing.status || 'active',
                        is_surplus: listing.is_surplus || false,
                    });
                    if (listing.images) {
                        setExistingImages(listing.images.sort((a, b) => a.display_order - b.display_order));
                    }
                } catch (err) {
                    console.error(err);
                    setError('Could not load listing data.');
                    showToast('Failed to load listing', 'error');
                }
            };
            loadListing();
        }
    }, [isEdit, listingId, loading]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        setError('');
        const files = Array.from(e.target.files);
        const total = existingImages.length + newImages.length + files.length;
        if (total > 6) {
            setError('Maximum of 6 images allowed.');
            return;
        }
        setNewImages(prev => [...prev, ...files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }))]);
    };

    const removeNewImage = (index) => {
        setNewImages(prev => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        
        const totalImages = existingImages.length + newImages.length;
        if (totalImages === 0) {
            setError('Please upload at least one image.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            let uploadedUrls = [];
            if (newImages.length > 0) {
                setUploadingImages(true);
                uploadedUrls = await Promise.all(newImages.map(img => uploadToCloudinary(img.file)));
                setUploadingImages(false);
            }

            const allUrls = [
                ...existingImages.map(img => img.image_url),
                ...uploadedUrls
            ];

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                price: parseFloat(formData.price),
                quantity: Number(formData.quantity),
                condition: formData.condition || null,
                category_id: formData.category_id,
                gender: formData.gender,
                size: formData.size || null,
                is_surplus: formData.is_surplus || false,
                images: allUrls.map((url, i) => ({ image_url: url, display_order: i })),
            };

            let response;
            if (isEdit) {
                // Add status for edit
                payload.status = formData.status;
                response = await updateListing(listingId, payload);
                showToast('Listing updated successfully!', 'success');
            } else {
                response = await createListing(payload);
                showToast('Listing created successfully!', 'success');
            }

            navigate('/seller/listings');
        } catch (err) {
            console.error('Error:', err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('\n'));
            } else {
                setError(detail || `Failed to ${isEdit ? 'update' : 'create'} listing.`);
            }
            showToast(`Failed to ${isEdit ? 'update' : 'create'} listing`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalImages = existingImages.length + newImages.length;

    return {
        // Data
        seller,
        options,
        loading,
        uploadingImages,
        submitting,
        error,
        formData,
        existingImages,
        newImages,
        totalImages,
        isRetailer,
        isEdit,
        fileInputRef,

        // Handlers
        handleChange,
        handleImageChange,
        removeNewImage,
        removeExistingImage,
        handleSubmit,
        setFormData,
    };
};