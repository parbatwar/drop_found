import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const listing = location.state?.listing;

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const deliveryFee = 100.00; 

    // Autofill with user's account phone number if it exists
    useEffect(() => {
        if (user?.phone) {
            setPhone(user.phone);
        }
    }, [user]);

    if (!listing) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <p className="text-sm text-neutral-400 font-light">No checkout item selected.</p>
                <Link to="/" className="text-xs uppercase tracking-widest underline">Return to shop</Link>
            </div>
        );
    }

    const totalAmount = parseFloat(listing.price) + deliveryFee;

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            await createOrder({
                listing_id: listing.id,
                receiver_phone: phone,
                delivery_address: address,
                payment_method: paymentMethod,
                delivery_fee: deliveryFee
            });
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to complete transaction checkout.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-white min-h-screen text-neutral-900 antialiased py-12 lg:py-20">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Form Processing Column */}
                <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
                    
                    {/* Shipping Address Forms */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">Shipping Details</h2>
                        
                        {error && <p className="text-xs text-red-600 font-light">{error}</p>}

                        <div className="space-y-1.5">
                            <label className="block text-[10px] text-neutral-400 uppercase tracking-widest">Receiver Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 98XXXXXXXX"
                                required
                                className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:border-black outline-none font-light rounded-sm bg-neutral-50/20"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] text-neutral-400 uppercase tracking-widest">Full Delivery Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Street name, Area landmark, City"
                                required
                                className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:border-black outline-none font-light rounded-sm bg-neutral-50/20"
                            />
                        </div>
                    </div>

                    {/* Payment Gateways */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">Payment Options</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {['esewa', 'khalti', 'cod'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-3 text-[10px] uppercase tracking-widest border font-medium transition-all rounded-sm ${
                                        paymentMethod === method 
                                            ? 'border-black bg-black text-white shadow-sm' 
                                            : 'border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-300'
                                    }`}
                                >
                                    {method === 'cod' ? 'COD' : method}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase hover:bg-neutral-800 disabled:opacity-40 transition-colors duration-300 rounded-sm"
                    >
                        {processing ? 'Processing Order...' : 'Confirm and Place Order'}
                    </button>
                </form>

                {/* Fixed Summary Layout Summary Card */}
                <div className="lg:col-span-5 bg-neutral-50 p-6 border border-neutral-100 rounded-sm space-y-6 lg:sticky lg:top-6">
                    <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 border-b pb-3">Order Invoice Summary</h2>
                    
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white overflow-hidden border border-neutral-200/60 p-1 flex-shrink-0">
                            {listing.images?.[0] && (
                                <img src={listing.images[0].image_url} alt="" className="w-full h-full object-contain" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase truncate text-black">{listing.title}</p>
                            <p className="text-[10px] tracking-wider text-neutral-400 uppercase mt-0.5">
                                Size {listing.size?.replace('_', ' ')} &middot; {listing.condition?.replace('_', ' ')}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200/60 pt-4 space-y-2.5 text-xs font-light">
                        <div className="flex justify-between text-neutral-500">
                            <span>Item Price</span>
                            <span className="text-neutral-900">NPR {Number(listing.price).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                            <span>Logistics Flat Fee</span>
                            <span className="text-neutral-900">NPR {deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-neutral-200/80 pt-3 font-normal text-black text-sm">
                            <span className="font-light">Total Estimated Cost</span>
                            <span className="font-semibold">NPR {totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Checkout;