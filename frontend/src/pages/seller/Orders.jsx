import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListing } from '../../api/listings';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    // New: Order Form State
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderData, setOrderData] = useState({
        delivery_method: 'seller',
        delivery_address: '',
        delivery_fee: 0,
    });
    const [ordering, setOrdering] = useState(false);
    const [orderError, setOrderError] = useState('');

    useEffect(() => {
        getListing(id)
            .then((res) => {
                setListing(res.data);
                setActiveIndex(0);
            })
            .catch(() => setError('Listing not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleOrderChange = (e) => {
        setOrderData({ ...orderData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setOrderError('');
        setOrdering(true);

        try {
            await createOrder({
                listing_id: listing.id,
                delivery_method: orderData.delivery_method,
                delivery_address: orderData.delivery_address,
                delivery_fee: parseFloat(orderData.delivery_fee) || 0,
            });
            navigate('/orders');
        } catch (err) {
            setOrderError(err.response?.data?.detail || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b border-black"></div></div>;

    if (error || !listing) return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
            <p className="text-neutral-400 text-xs uppercase tracking-widest">{error || 'Listing not found'}</p>
            <Link to="/" className="text-xs uppercase tracking-widest text-black border-b border-black pb-0.5 inline-block">Back to Home</Link>
        </div>
    );

    const hasImages = listing.images && listing.images.length > 0;

    return (
        <div className="bg-white min-h-screen text-neutral-900 antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
                    
                    {/* LEFT SIDE: Image Gallery (Same as your code) */}
                    <div className="space-y-4">
                         <div className="relative aspect-square w-full bg-neutral-50 border border-neutral-100 overflow-hidden">
                            {hasImages ? <img src={listing.images[activeIndex].image_url} className="w-full h-full object-contain p-6" alt={listing.title} /> : <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>}
                        </div>
                    </div>

                    {/* RIGHT SIDE: EDITORIAL DATA PANEL + ORDER FORM */}
                    <div className="space-y-8">
                        <div className="space-y-3 pb-6 border-b border-neutral-100">
                            <h1 className="text-2xl font-light uppercase">{listing.title}</h1>
                            <p className="text-xl font-light">NPR {Number(listing.price).toLocaleString()}</p>
                        </div>

                        {!showOrderForm ? (
                            <button
                                onClick={() => {
                                    if (!user) return navigate('/login');
                                    setShowOrderForm(true);
                                }}
                                className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <form onSubmit={handlePlaceOrder} className="space-y-4 border border-neutral-200 p-6">
                                <h3 className="text-xs font-medium uppercase tracking-wider">Delivery Details</h3>
                                {orderError && <p className="text-red-500 text-xs">{orderError}</p>}
                                
                                <select name="delivery_method" value={orderData.delivery_method} onChange={handleOrderChange} className="w-full border-b border-neutral-300 py-2 text-sm outline-none">
                                    <option value="seller">Seller Delivers</option>
                                    <option value="courier">Courier Pickup</option>
                                </select>
                                
                                <input name="delivery_address" placeholder="Delivery Address" required onChange={handleOrderChange} className="w-full border-b border-neutral-300 py-2 text-sm outline-none" />
                                
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" disabled={ordering} className="flex-1 bg-black text-white py-3 text-xs uppercase hover:bg-neutral-800">
                                        {ordering ? 'Processing...' : 'Confirm Order'}
                                    </button>
                                    <button type="button" onClick={() => setShowOrderForm(false)} className="px-6 border border-neutral-300 text-xs uppercase">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;