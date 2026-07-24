// pages/orders/Cart.jsx - Properly Refactored
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../api/cart';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Icons } from '../../components/Icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { getOrderImageUrl, getOrderTitle } from '../../utils/orderUtils';

function Cart() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [user]);

    const loadCart = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getCart();
            setCart(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load your cart.');
            showToast('Failed to load your cart', 'error');
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
            setError('Failed to update quantity.');
            showToast('Failed to update quantity', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = (itemId) => {
        setConfirmAction({ type: 'remove', itemId });
        setShowConfirm(true);
    };

    const handleClearCart = () => {
        setConfirmAction({ type: 'clear' });
        setShowConfirm(true);
    };

    const confirmActionHandler = async () => {
        if (!confirmAction) return;
        setUpdating(true);
        try {
            if (confirmAction.type === 'remove') {
                await removeCartItem(confirmAction.itemId);
                showToast('Item removed from cart', 'success');
            } else if (confirmAction.type === 'clear') {
                await clearCart();
                showToast('Cart cleared successfully', 'success');
            }
            await loadCart();
        } catch (err) {
            showToast('Failed to update cart', 'error');
        } finally {
            setUpdating(false);
            setShowConfirm(false);
            setConfirmAction(null);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return <LoadingSpinner message="Loading Cart..." />;
    }

    const items = cart?.items || [];
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = cart?.subtotal || 0;
    const deliveryFee = cart?.delivery_fee || 0;
    const total = cart?.total || 0;
    const sellerBreakdown = cart?.seller_breakdown || [];

    // Group items by seller
    const groupedItems = items.reduce((groups, item) => {
        const sellerId = item.seller_id || 'unknown';
        if (!groups[sellerId]) {
            groups[sellerId] = {
                seller_id: sellerId,
                shop_name: item.shop_name || 'Shop',
                items: [],
                subtotal: 0
            };
        }
        groups[sellerId].items.push(item);
        groups[sellerId].subtotal += (item.price || 0) * (item.quantity || 0);
        return groups;
    }, {});

    if (items.length === 0) {
        return (
            <div className="bg-white min-h-screen py-12 md:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="mb-10 border-b border-neutral-100 pb-6">
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">Cart</span>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">Shopping Cart</h1>
                    </div>
                    <EmptyState icon="🛒" title="Your cart is empty" subtitle="Start shopping to add items to your cart." actionLabel="Start Shopping" actionLink="/" />
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
                            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">Cart</span>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">Shopping Cart</h1>
                            <p className="text-sm text-neutral-500 mt-2">Review your items before checkout.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-light text-neutral-300">{totalItems}</span>
                            <p className="text-[9px] text-neutral-400 uppercase tracking-wider">Items</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-2 border-red-400 px-4 py-3 text-sm text-red-600">{error}</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        {Object.values(groupedItems).map((group) => (
                            <div key={group.seller_id} className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-xs font-medium text-neutral-700 uppercase tracking-wider">{group.shop_name}</h3>
                                    <span className="text-[9px] text-neutral-400">({group.items.length} items)</span>
                                </div>

                                <div className="space-y-3">
                                    {group.items.map((item) => {
                                        const imageUrl = getOrderImageUrl({ items: [item] });
                                        const title = getOrderTitle({ items: [item] });
                                        const price = item.price || 0;

                                        return (
                                            <div key={item.id} className="flex gap-4 p-4 border border-neutral-100 hover:border-neutral-300 transition-colors duration-200">
                                                <div className="w-24 h-28 flex-shrink-0 bg-neutral-50 border border-neutral-100 overflow-hidden">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px] uppercase tracking-wider">No Image</div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-light text-neutral-800">{title}</p>
                                                    <p className="text-sm font-medium text-neutral-900 mt-2">NPR {Number(price).toLocaleString()}</p>
                                                </div>

                                                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                                                    <button onClick={() => handleRemoveItem(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors" disabled={updating}>
                                                        <Icons.X className="w-4 h-4" />
                                                    </button>

                                                    <div className="flex items-center border border-neutral-200">
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={updating} className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50">−</button>
                                                        <span className="w-8 text-center text-xs">{item.quantity || 0}</span>
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={updating} className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-2 text-right">
                                    <div className="flex items-center justify-end gap-4 text-sm">
                                        <span className="text-neutral-500">Subtotal: <span className="text-neutral-900">NPR {group.subtotal.toLocaleString()}</span></span>
                                        <span className="text-neutral-400">|</span>
                                        <span className="text-neutral-500">Delivery: <span className="text-neutral-900">NPR {group.subtotal < 700 ? 80 : 120}</span></span>
                                        <span className="text-[9px] text-neutral-400">({group.subtotal < 700 ? 'Under NPR 700' : 'NPR 700 and above'})</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={handleClearCart} disabled={updating} className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-red-500 transition-colors">Clear Cart</button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="border border-neutral-100 p-6 md:p-8 lg:sticky lg:top-24">
                            <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-medium pb-4 border-t-neutral-100">Order Summary</h2>

                            <div className="space-y-2.5 pt-4 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span className="text-neutral-900">NPR {Number(subtotal).toLocaleString()}</span>
                                </div>
                                <div className="text-neutral-500 border-t border-neutral-100 pt-2">
                                    <div className="flex justify-between text-xs font-medium text-neutral-600">
                                        <span>Delivery Fee</span>
                                        <span>NPR {Number(deliveryFee).toLocaleString()}</span>
                                    </div>
                                    {sellerBreakdown.length > 0 && (
                                        <div className="mt-1 space-y-0.5">
                                            {sellerBreakdown.map((seller) => (
                                                <div key={seller.seller_id} className="flex justify-between text-[10px] text-neutral-400 ml-4">
                                                    <span>{seller.shop_name}</span>
                                                    <span>NPR {Number(seller.delivery_fee).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between pt-3 border-t border-neutral-100 text-base">
                                    <span className="font-light text-neutral-600">Total</span>
                                    <span className="font-medium text-black">NPR {Number(total).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-3 text-[9px] text-neutral-400 leading-relaxed bg-neutral-50 p-3 border border-neutral-100">
                                <p className="font-medium text-neutral-600">Delivery Fee Breakdown:</p>
                                <p className="mt-1">• Calculated per seller's suborder</p>
                                <p>• Under NPR 700: NPR 80 delivery fee</p>
                                <p>• NPR 700 and above: NPR 120 delivery fee</p>
                                <p className="mt-1 text-neutral-300">Items from different sellers are charged separately.</p>
                            </div>

                            <button onClick={handleCheckout} className="w-full mt-6 bg-black text-white py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-neutral-800 transition-colors duration-300">Proceed to Checkout</button>

                            <Link to="/" className="block text-center mt-3 text-[10px] text-neutral-400 hover:text-black transition-colors uppercase tracking-wider">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Single Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => {
                    setShowConfirm(false);
                    setConfirmAction(null);
                }}
                onConfirm={confirmActionHandler}
                title={confirmAction?.type === 'clear' ? 'Clear Cart' : 'Remove Item'}
                message={confirmAction?.type === 'clear' ? 'Are you sure you want to remove all items from your cart?' : 'Are you sure you want to remove this item from your cart?'}
                confirmLabel={confirmAction?.type === 'clear' ? 'Clear All' : 'Remove'}
                confirmVariant="danger"
                loading={updating}
            />
        </div>
    );
}

export default Cart;