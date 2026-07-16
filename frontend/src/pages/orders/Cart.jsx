// pages/orders/Cart.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../api/cart';
import { useAuth } from '../../context/AuthContext';
import { Icons } from '../../components/Icons';

function Cart() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [user]);

    const loadCart = async () => {
        try {
            const res = await getCart();

            // console.log("Cart data:");
            // console.log(res.data);
            // console.log(JSON.stringify(res.data, null, 2));

            setCart(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setUpdating(true);
        try {
            await updateCartItem(itemId, { quantity: newQuantity });
            await loadCart();
        } catch (err) {
            console.error('Failed to update quantity:', err);
            setError('Failed to update quantity.');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setUpdating(true);
        try {
            await removeCartItem(itemId);
            await loadCart();
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Failed to remove item.');
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Are you sure you want to clear your cart?')) return;
        setUpdating(true);
        try {
            await clearCart();
            await loadCart();
        } catch (err) {
            console.error('Failed to clear cart:', err);
            setError('Failed to clear cart.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading Cart...
                </div>
            </div>
        );
    }

    const items = cart?.items || [];
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const subtotal = cart?.subtotal || 0;
    const deliveryFee = cart?.delivery_fee || 0;
    const total = cart?.total || 0;

    if (items.length === 0) {
        return (
            <div className="bg-white min-h-screen py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="mb-10 border-b border-neutral-100 pb-6">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                            Cart
                        </span>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                            Shopping Cart
                        </h1>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                        <div className="text-4xl font-light text-neutral-300 mb-4">🛒</div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">
                            Your cart is empty
                        </p>
                        <p className="text-[10px] text-neutral-300 mt-2">
                            Start shopping to add items to your cart.
                        </p>
                        <Link 
                            to="/" 
                            className="inline-block mt-6 border border-black px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
                
                {/* Header */}
                <div className="mb-10 border-b border-neutral-100 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                                Cart
                            </span>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                                Shopping Cart
                            </h1>
                            <p className="text-sm text-neutral-500 mt-2">
                                Review your items before checkout.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-light text-neutral-300">
                                {totalItems}
                            </span>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                Items
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            {items.map((item) => {
                                return (
                                    <div 
                                        key={item.id} 
                                        className="flex gap-4 p-4 border border-neutral-100 hover:border-neutral-300 transition-colors duration-200"
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-28 flex-shrink-0 bg-neutral-50 border border-neutral-100 overflow-hidden">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px] uppercase tracking-wider">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/product/${item.listing_id}`}
                                                className="text-sm font-light text-neutral-800 hover:text-black transition-colors"
                                            >
                                                {item.title}
                                            </Link>

                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                                    {item.shop_name}
                                                </span>
                                            </div>

                                            <p className="text-sm font-medium text-neutral-900 mt-2">
                                                NPR {Number(item.price).toLocaleString()}
                                            </p>

                                            <p className="text-xs text-neutral-500 mt-1">
                                                Qty: {item.quantity} × NPR {Number(item.price).toLocaleString()}
                                            </p>

                                            <p className="text-sm font-semibold text-black mt-1">
                                                Total: NPR {Number(item.line_total).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-neutral-400 hover:text-red-500 transition-colors"
                                                disabled={updating}
                                            >
                                                <Icons.X className="w-4 h-4" />
                                            </button>

                                            <div className="flex items-center border border-neutral-200">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updating}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50"
                                                >
                                                    −
                                                </button>

                                                <span className="w-8 text-center text-xs">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updating}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Clear Cart */}
                        <button
                            onClick={handleClearCart}
                            disabled={updating}
                            className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-red-500 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="border border-neutral-100 p-6 md:p-8 lg:sticky lg:top-24">
                            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium pb-4 border-b border-neutral-100">
                                Order Summary
                            </h2>

                            <div className="space-y-2.5 pt-4 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="text-neutral-900">NPR {subtotal.toLocaleString()}</span>
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

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-black text-white py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                            >
                                Proceed to Checkout
                            </button>

                            <Link 
                                to="/" 
                                className="block text-center mt-3 text-[10px] text-neutral-400 hover:text-black transition-colors uppercase tracking-wider"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Cart;