// src/pages/seller/EditListing.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMySellerProfile } from '../../api/seller';
import { getListing, updateListing } from '../../api/listings';
import { getListingOptions } from '../../api/meta';

function EditListing() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [seller, setSeller] = useState(null);
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        size: '',
        status: '',
    });

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    sellerRes,
                    listingRes,
                    optionsRes,
                ] = await Promise.all([
                    getMySellerProfile(),
                    getListing(id),
                    getListingOptions(),
                ]);

                const listing = listingRes.data;

                setSeller(sellerRes.data);
                setOptions(optionsRes.data);

                setFormData({
                    title: listing.title || '',
                    description:
                        listing.description || '',
                    price:
                        listing.price ?? '',
                    condition:
                        listing.condition || '',
                    category:
                        listing.category || '',
                    size:
                        listing.size || '',
                    status:
                        listing.status || '',
                });
            } catch (err) {
                console.error(err);
                setError(
                    'Could not load listing'
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                title: formData.title,
                description:
                    formData.description,
                price:
                    formData.price
                        ? Number(
                              formData.price
                          )
                        : null,
                category:
                    formData.category ||
                    null,

                condition:
                    seller?.seller_type ===
                    'thrift'
                        ? formData.condition ||
                          null
                        : null,

                size:
                    formData.size ||
                    null,

                status:
                    formData.status ||
                    null,
            };

            await updateListing(
                id,
                payload
            );

            navigate(
                '/seller/listings'
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data
                    ?.detail ||
                    'Failed to update listing'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <p className="max-w-2xl mx-auto px-4 py-12 text-sm text-gray-400">
                Loading...
            </p>
        );
    }

    if (error && !seller) {
        return (
            <p className="max-w-2xl mx-auto px-4 py-12 text-sm text-red-500">
                {error}
            </p>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-light tracking-[0.1em] mb-2">
                Edit Listing
            </h1>

            <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">
                {seller?.seller_type}{' '}
                listing
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6 text-sm">
                    {error}
                </div>
            )}

            <form
                onSubmit={
                    handleSubmit
                }
                className="space-y-6"
            >
                {/* Title */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        rows={4}
                        className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Price (NPR)
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={
                            formData.price
                        }
                        onChange={
                            handleChange
                        }
                        required
                        min="0"
                        step="0.01"
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Category
                    </label>

                    <select
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                    >
                        <option value="">
                            Select
                            category
                        </option>

                        {options?.categories?.map(
                            (
                                cat
                            ) => (
                                <option
                                    key={
                                        cat
                                    }
                                    value={
                                        cat
                                    }
                                >
                                    {cat.replaceAll(
                                        '_',
                                        ' '
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Condition */}
                {seller?.seller_type ===
                    'thrift' && (
                    <div>
                        <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                            Condition
                        </label>

                        <select
                            name="condition"
                            value={
                                formData.condition
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                        >
                            <option value="">
                                Select
                                condition
                            </option>

                            {options?.conditions?.map(
                                (
                                    condition
                                ) => (
                                    <option
                                        key={
                                            condition
                                        }
                                        value={
                                            condition
                                        }
                                    >
                                        {condition.replaceAll(
                                            '_',
                                            ' '
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                {/* Size */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Size
                        (optional)
                    </label>

                    <select
                        name="size"
                        value={
                            formData.size
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border-b border-gray-300 px-0 py-3 text-sm focus:border-black outline-none bg-white"
                    >
                        <option value="">
                            No size
                        </option>

                        {options?.sizes?.map(
                            (
                                size
                            ) => (
                                <option
                                    key={
                                        size
                                    }
                                    value={
                                        size
                                    }
                                >
                                    {size.replaceAll(
                                        '_',
                                        ' '
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs tracking-wider uppercase text-gray-500 mb-2">
                        Status
                    </label>

                    <select name="status" value={formData.status} onChange={handleChange} className="...">
                        <option value="">Select status</option>
                        {options?.statuses?.map((status) => (
                            <option key={status} value={status}>
                                {status.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={
                        submitting
                    }
                    className="w-full bg-black text-white py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {submitting
                        ? 'Saving...'
                        : 'Update Listing'}
                </button>
            </form>
        </div>
    );
}

export default EditListing;