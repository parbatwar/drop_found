// frontend/src/hooks/useSellerApplication.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { applySeller, getMySellerProfile } from '../api/seller';
import { getSellerOptions } from '../api/meta';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_DOCUMENT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

export const useSellerApplication = () => {
    const navigate = useNavigate();

    const [sellerTypes, setSellerTypes] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [businessType, setBusinessType] = useState('individual');
    const [isReapplying, setIsReapplying] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState({});
    
    const [formData, setFormData] = useState({
        shop_name: '',
        bio: '',
        location: '',
        seller_type: '',
        avatar_url: '',
        business_type: 'individual',
        business_phone: '',
        business_email: '',
        identity_front_url: '',
        identity_back_url: '',
        selfie_url: '',
        pan_certificate_url: '',
        registration_certificate_url: '',
        business_registration_number: '',
        pan_number: '',
    });

    const [previews, setPreviews] = useState({
        logo: null,
        identity_front: null,
        identity_back: null,
        selfie: null,
        pan_certificate: null,
        registration_certificate: null,
    });

    const formDataRef = useRef(formData);
    const isBusiness = businessType === 'registered';

    useEffect(() => {
        const init = async () => {
            try {
                let existing = null;
                try {
                    const profile = await getMySellerProfile();
                    const status = profile.data?.verification_status;
                    if (status === 'pending' || status === 'approved') {
                        navigate('/seller/dashboard', { replace: true });
                        return;
                    }
                    if (status === 'rejected') {
                        existing = profile.data;
                        setIsReapplying(true);
                    }
                } catch (e) {}

                const options = await getSellerOptions();
                const types = options.data?.seller_types || [];
                setSellerTypes(types);

                if (existing) {
                    setFormData(prev => ({
                        ...prev,
                        shop_name: existing.shop_name || '',
                        bio: existing.bio || '',
                        location: existing.location || '',
                        seller_type: existing.seller_type || types[0] || '',
                        avatar_url: existing.avatar_url || '',
                        business_type: existing.business_type || 'individual',
                        business_phone: existing.business_phone || '',
                        business_email: existing.business_email || '',
                    }));
                    setBusinessType(existing.business_type || 'individual');
                    if (existing.avatar_url) setPreviews(prev => ({ ...prev, logo: existing.avatar_url }));
                } else if (types.length) {
                    setFormData(prev => ({ ...prev, seller_type: types[0] }));
                }
            } catch (err) {
                setError('Could not load configurations.');
            } finally {
                setFetchingOptions(false);
            }
        };
        init();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            formDataRef.current = newData;
            return newData;
        });
    };

    // ✅ Updated handleUpload with field mapping
    const handleUpload = async (field, file) => {
        if (!file) return;
        
        // ✅ Map display field names to actual formData field names
        const fieldMapping = {
            'logo': 'avatar_url',
            'identity_front': 'identity_front_url',
            'identity_back': 'identity_back_url',
            'selfie': 'selfie_url',
            'pan_certificate': 'pan_certificate_url',
            'registration_certificate': 'registration_certificate_url',
        };
        
        const actualField = fieldMapping[field] || field;
        
        const isDocument = ['pan_certificate', 'registration_certificate'].includes(field);
        const isLogo = field === 'logo';
        const isIdentity = ['identity_front', 'identity_back'].includes(field);
        
        const allowedTypes = isDocument ? ACCEPTED_DOCUMENT_TYPES : ACCEPTED_IMAGE_TYPES;
        
        if (!allowedTypes.includes(file.type)) {
            setError(isDocument 
                ? 'Unsupported format. Please upload JPG, PNG, or PDF.'
                : 'Unsupported format. Please upload JPG, PNG, or WebP.'
            );
            return;
        }
        
        const maxSize = isDocument ? MAX_DOCUMENT_SIZE : MAX_FILE_SIZE;
        if (file.size > maxSize) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            setError(`File too large (${sizeInMB}MB). Maximum size is ${isDocument ? '5' : '2'}MB.`);
            return;
        }

        setError('');
        setUploading(prev => ({ ...prev, [field]: true }));
        
        if (!isDocument || file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({ ...prev, [field]: 'pdf-placeholder' }));
        }

        try {
            const folder = isLogo ? 'logos' : isIdentity ? 'identity' : isDocument ? 'documents' : 'uploads';
            const url = await uploadToCloudinary(file, { 
                folder: folder,
                isDocument: isDocument 
            });
            
            // ✅ Update with the correct field name
            setFormData(prev => {
                const newData = { ...prev, [actualField]: url };
                formDataRef.current = newData;
                console.log('📝 Updated formData:', newData);
                return newData;
            });
            
            console.log(`✅ Uploaded ${field} -> ${actualField}:`, url);
            setError('');
            return url;
        } catch (err) {
            console.error(`❌ Failed to upload ${field}:`, err);
            setError(`Failed to upload ${field.replace('_', ' ')}. Please try again.`);
            setPreviews(prev => ({ ...prev, [field]: null }));
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const removeFile = (field) => {
        setPreviews(prev => ({ ...prev, [field]: null }));
        setFormData(prev => {
            const newData = { ...prev, [field]: '' };
            formDataRef.current = newData;
            return newData;
        });
    };

    const validateStep = (step) => {
        const data = formDataRef.current;
        
        console.log('🔍 Validating Step:', step);
        console.log('🔍 Identity Front URL:', data.identity_front_url);
        console.log('🔍 Identity Back URL:', data.identity_back_url);
        
        switch(step) {
            case 1:
                if (!data.shop_name.trim() || data.shop_name.trim().length < 3) {
                    setError('Shop name is required and must be at least 3 characters.');
                    return false;
                }
                if (!data.seller_type) {
                    setError('Please select a category.');
                    return false;
                }
                const phoneRegex = /^[0-9]{10}$/;
                if (!data.business_phone || !phoneRegex.test(data.business_phone.trim())) {
                    setError('Business phone number must be exactly 10 digits (e.g., 9851234567).');
                    return false;
                }
                if (data.business_email && data.business_email.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(data.business_email.trim())) {
                        setError('Please enter a valid business email address (e.g., info@shop.com).');
                        return false;
                    }
                }
                if (isBusiness && !data.location.trim()) {
                    setError('Location is required for business sellers.');
                    return false;
                }
                if (isBusiness) {
                    const regNumberRegex = /^[A-Za-z0-9-]{5,}$/;
                    if (!data.business_registration_number || !regNumberRegex.test(data.business_registration_number.trim())) {
                        setError('Business Registration Number is required and must be at least 5 alphanumeric characters.');
                        return false;
                    }
                    const panRegex = /^[0-9]{9,15}$/;
                    if (!data.pan_number || !panRegex.test(data.pan_number.trim())) {
                        setError('PAN Number is required and must be 9-15 digits (e.g., 123456789).');
                        return false;
                    }
                }
                return true;
                
            case 2:
                if (!data.identity_front_url) {
                    setError('Please upload the front of your ID.');
                    return false;
                }
                if (!data.identity_back_url) {
                    setError('Please upload the back of your ID.');
                    return false;
                }
                return true;
                
            case 3:
                if (isBusiness) {
                    if (!data.pan_certificate_url) {
                        setError('Please upload your PAN certificate.');
                        return false;
                    }
                    if (!data.registration_certificate_url) {
                        setError('Please upload your registration certificate.');
                        return false;
                    }
                }
                return true;
                
            default:
                return true;
        }
    };

    const goToNextStep = () => {
        const isUploading = Object.values(uploading).some(val => val === true);
        if (isUploading) {
            setError('Please wait for uploads to complete.');
            return;
        }
        
        if (validateStep(currentStep)) {
            setError('');
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const goToPreviousStep = () => {
        setError('');
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        
        setLoading(true);
        setError('');

        try {
            const payload = {
                shop_name: formDataRef.current.shop_name.trim(),
                bio: formDataRef.current.bio.trim() || null,
                location: formDataRef.current.location.trim() || null,
                seller_type: formDataRef.current.seller_type,
                avatar_url: formDataRef.current.avatar_url || null,
                business_type: businessType,
                business_phone: formDataRef.current.business_phone.trim(),
                business_email: formDataRef.current.business_email.trim() || null,
                identity_front_url: formDataRef.current.identity_front_url,
                identity_back_url: formDataRef.current.identity_back_url,
                selfie_url: formDataRef.current.selfie_url || null,
                pan_certificate_url: formDataRef.current.pan_certificate_url || null,
                registration_certificate_url: formDataRef.current.registration_certificate_url || null,
                business_registration_number: formDataRef.current.business_registration_number || null,
                pan_number: formDataRef.current.pan_number || null,
            };

            console.log('📤 Submitting payload:', payload);
            await applySeller(payload);
            navigate('/seller/dashboard', {
                state: {
                    message: isBusiness
                        ? 'Application submitted! Business verification takes 2-3 business days.'
                        : 'Application submitted! Identity verification takes 1-2 business days.'
                }
            });
        } catch (err) {
            console.error('❌ Submission failed:', err);
            setError(err.response?.data?.detail || 'Submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return {
        currentStep,
        businessType,
        isBusiness,
        isReapplying,
        fetchingOptions,
        loading,
        error,
        formData,
        sellerTypes,
        previews,
        uploading,
        setBusinessType,
        handleChange,
        handleUpload,
        removeFile,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
    };
};