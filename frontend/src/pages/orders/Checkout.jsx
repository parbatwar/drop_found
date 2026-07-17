import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getCart } from "../../api/cart";
import { checkoutCart, quickBuy } from '../../api/orders';
import { getDeliveryFee } from '../../api/meta';
import { useAuth } from '../../context/AuthContext';
import { Icons } from '../../components/Icons';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const listing = location.state?.listing;
    const quantity = location.state?.quantity || 1;
    const isQuickBuy = location.state?.quickBuy === true;
    
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if (user?.phone) {
            setPhone(user.phone);
        }
    }, [user]);

    useEffect(() => {
    if (!isQuickBuy) {
        getCart()
            .then((res) => setCart(res.data))
            .catch(console.error);
    }
}, [isQuickBuy]);

    useEffect(() => {
        getDeliveryFee()
            .then((res) => setDeliveryFee(res.data.delivery_fee))
            .catch((err) => console.error('Failed to fetch delivery fee:', err));
    }, []);

    if (isQuickBuy && !listing) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-4xl font-light text-neutral-200 mb-4">🛒</div>
                    <p className="text-sm text-neutral-400 mb-6">No checkout item selected.</p>
                    <Link
                        to="/"
                        className="inline-block border border-black px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                    >
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const itemSubtotal = isQuickBuy ? parseFloat(listing.price) * quantity : null;
    const total = isQuickBuy ? itemSubtotal + deliveryFee : null;

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            let result;
            if (isQuickBuy) {
                result = await quickBuy({
                    listing_id: listing.id,
                    quantity: quantity,
                    receiver_phone: phone,
                    delivery_address: address,
                    payment_method: paymentMethod,
                });
            } else {
                result = await checkoutCart({
                    receiver_phone: phone,
                    delivery_address: address,
                    payment_method: paymentMethod,
                });
            }
            navigate('/orders', { state: { justPlaced: result.data } });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to complete checkout.');
        } finally {
            setProcessing(false);
        }
    };

    const paymentMethods = [
        { id: 'esewa', label: 'eSewa', icon: Icons.Wallet },
        { id: 'khalti', label: 'Khalti', icon: Icons.CreditCard },
        { id: 'cod', label: 'Cash on Delivery', icon: Icons.Truck },
    ];

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">

                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Checkout
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        Complete Your Order
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2">
                        Review your {isQuickBuy ? 'item' : 'cart'} and provide delivery details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmitOrder} className="space-y-8">

                            <div className="space-y-5">
                                <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                    Shipping Details
                                </h2>

                                {error && (
                                    <div className="bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                        Phone Number <span className="text-neutral-300">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g., 98XXXXXXXX"
                                        required
                                        className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium mb-2">
                                        Delivery Address <span className="text-neutral-300">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Street name, Area, City"
                                        required
                                        className="w-full border-b border-neutral-200 px-0 py-3 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors duration-300 bg-transparent"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                                    Payment Method <span className="text-neutral-300">*</span>
                                </h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 text-[10px] uppercase tracking-wider border transition-all duration-300 ${
                                                    paymentMethod === method.id
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300'
                                                }`}
                                            >
                                                <Icon className={`w-5 h-5 ${
                                                    paymentMethod === method.id ? 'text-white' : 'text-neutral-400'
                                                }`} />
                                                {method.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing Order...' : 'Confirm & Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="border border-neutral-100 p-6 md:p-8 lg:sticky lg:top-24">
                            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium pb-4 border-b border-neutral-100">
                                Order Summary
                            </h2>

                            {isQuickBuy ? (
                                <>
                                    <div className="flex gap-4 pt-4 pb-4 border-b border-neutral-100">
                                        <div className="w-20 h-20 flex-shrink-0 bg-neutral-50 border border-neutral-100 overflow-hidden">
                                            {listing.images?.[0] && (
                                                <img
                                                    src={listing.images[0].image_url}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-light text-neutral-800 truncate">
                                                {listing.title}
                                            </p>
                                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">
                                                Qty: {quantity}
                                            </p>
                                            <p className="text-sm font-medium text-neutral-900 mt-1">
                                                NPR {Number(listing.price).toLocaleString()} each
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 pt-4 text-sm">
                                        <div className="flex justify-between text-neutral-500">
                                            <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                                            <span className="text-neutral-900">NPR {itemSubtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-500">
                                            <span>Delivery Fee</span>
                                            <span className="text-neutral-900">NPR {deliveryFee.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-neutral-100 text-base">
                                            <span className="font-light text-neutral-600">Total</span>
                                            <span className="font-medium text-black">NPR {total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-4 pt-4">
                                        {cart?.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-3 border-b border-neutral-100 pb-3"
                                            >
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover border"
                                                />

                                                <div className="flex-1">
                                                    <p className="text-sm">{item.title}</p>
                                                    <p className="text-xs text-neutral-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>

                                                <p className="text-sm font-medium">
                                                    NPR {item.line_total.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>NPR {(cart?.subtotal ?? 0).toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Delivery</span>
                                            <span>NPR {(cart?.delivery_fee ?? 0).toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between border-t pt-3 font-medium">
                                            <span>Total</span>
                                            <span>NPR {(cart?.total ?? 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Checkout;