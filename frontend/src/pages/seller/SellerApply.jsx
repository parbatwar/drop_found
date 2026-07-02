// src/pages/SellerApply.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applySeller } from '../../api/seller';
import { getSellerOptions } from '../../api/meta';

function SellerApply() {
    const navigate = useNavigate();
    const [sellerTypes, setSellerTypes] = useState([]);
    
    const [formData, setFormData] = useState({
        shop_name: '',
        bio: '',
        location: '',
        seller_type: '',
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(true);

    // Fetch dynamic enum options on mount via your custom client method
    useEffect(() => {
        getSellerOptions()
            .then((res) => {
                const types = res.data?.seller_types || [];
                setSellerTypes(types);
                
                // Establish initial select value fallback safely
                if (types.length > 0) {
                    setFormData(prev => ({ ...prev, seller_type: types[0] }));
                }
            })
            .catch((err) => {
                console.error("Failed to load seller enums:", err);
                setError("Could not load backend configurations safely.");
            })
            .finally(() => setFetchingOptions(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                shop_name: formData.shop_name.trim(),
                bio: formData.bio.trim() || null,
                location: formData.location.trim() || null,
                seller_type: formData.seller_type,
            };

            await applySeller(payload);
            
            navigate('/seller/dashboard', { 
                state: { message: 'Successfully applied as seller!' } 
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong while submitting your application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen text-neutral-900 py-16 md:py-24">
            <div className="max-w-xl mx-auto px-4 sm:px-6">
                
                {/* Header Layout */}
                <div className="space-y-3 mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block">
                        Open a Shop
                    </span>
                    <h1 className="text-3xl font-light tracking-[0.08em] text-black uppercase">
                        Seller Application
                    </h1>
                </div>
                
                {/* Clean Status Interventions */}
                {error && (
                    <div className="bg-neutral-50 border-l-2 border-black text-neutral-800 px-4 py-3 text-xs tracking-wide mb-8 uppercase">
                        <span className="font-medium text-black">Status:</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Shop Name */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Shop Name *
                        </label>
                        <input
                            type="text"
                            name="shop_name"
                            value={formData.shop_name}
                            onChange={handleChange}
                            placeholder="e.g., Kathmandu Vintage Hub"
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none"
                            required
                        />
                    </div>

                    {/* Dynamic Seller Type Dropdown Selector */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Seller Type *
                        </label>
                        {fetchingOptions ? (
                            <div className="h-10 bg-neutral-50 animate-pulse border border-neutral-200 rounded-sm" />
                        ) : (
                            <select
                                name="seller_type"
                                value={formData.seller_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none appearance-none cursor-pointer capitalize"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                            >
                                {sellerTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Location Hub
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Jhamsikhel, Lalitpur"
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-[10px] tracking-widest uppercase font-medium text-neutral-500 mb-1.5">
                            Shop Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your collection style..."
                            rows={4}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 text-sm text-black rounded-sm focus:border-black focus:outline-none resize-none"
                        />
                    </div>

                    {/* Submit Handle Action */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || fetchingOptions}
                            className="w-full bg-black text-white px-6 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SellerApply;