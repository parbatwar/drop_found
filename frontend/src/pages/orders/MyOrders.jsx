import { useState, useEffect } from 'react';
import { getMyOrders } from '../../api/orders';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders()
            .then((res) => setOrders(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-light tracking-[0.1em] mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-sm text-gray-400">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">
                                    Order #{order.id.slice(0, 8)}
                                </span>
                                <span className={`text-xs px-3 py-1 uppercase tracking-wider ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                                    <p>NPR {order.total_amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Delivery</p>
                                    <p className="capitalize">{order.delivery_method}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
                                    <p>{order.delivery_address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;