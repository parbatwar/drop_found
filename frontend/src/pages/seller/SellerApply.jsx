// src/pages/SellerApply.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applySeller } from '../../api/seller';

function SellerApply() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shop_name: '',
        shop_description: '',
        shop_address: '',
        contact_number: '',
        business_type: 'individual',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ✅ Simple - just call the API
            await applySeller(formData);
            
            // ✅ Success - redirect to dashboard
            navigate('/seller/dashboard', { 
                state: { message: 'Successfully applied as seller!' } 
            });
        } catch (err) {
            // ✅ Simple error handling
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-light tracking-[0.1em] mb-8">
                Apply to Become a Seller
            </h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Name *
                    </label>
                    <input
                        type="text"
                        name="shop_name"
                        value={formData.shop_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Description
                    </label>
                    <textarea
                        name="shop_description"
                        value={formData.shop_description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Address
                    </label>
                    <input
                        type="text"
                        name="shop_address"
                        value={formData.shop_address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                    </label>
                    <input
                        type="tel"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type
                    </label>
                    <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    >
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white px-6 py-3 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Submitting...' : 'Apply Now'}
                </button>
            </form>
        </div>
    );
}

export default SellerApply;