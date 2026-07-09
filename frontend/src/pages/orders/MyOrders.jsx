import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orders";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
          Loading
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Editorial Header */}
      <header className="border-b border-neutral-200 pb-8 mb-16">
        <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mb-2">
          Account
        </p>
        <h1 className="text-3xl font-light tracking-[0.08em] uppercase">
          My Orders
        </h1>
        <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mt-2">
          {orders.length} Historical Records
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-neutral-50 border-l-2 border-black p-6 text-[10px] uppercase tracking-widest text-neutral-600">
          No order history found.
        </div>
      ) : (
        <div className="space-y-28">
          {orders.map((order) => (
            <article key={order.id} className="group">
              {/* Order Meta Header */}
              <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">
                  Ref: {order.id.slice(-8)}
                </span>
                <StatusBadge status={order.status} />
              </div>

              {/* Editorial Layout */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                <div className="md:col-span-2">
                  <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <img
                      src={order.listing?.images?.[0]?.image_url}
                      alt={order.listing?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h2 className="text-xl font-light uppercase tracking-wide mb-1">
                      {order.listing?.title || "Product"}
                    </h2>
                    <p className="text-lg font-medium tracking-wide">
                      NPR {Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-neutral-100">
                    <OrderDetail label="Payment" value={order.payment_method} />
                    <OrderDetail label="Phone" value={order.receiver_phone} />
                    <OrderDetail 
                      label="Date" 
                      value={new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })} 
                    />
                    <OrderDetail label="Status" value={order.status} isStatus />
                    <OrderDetail label="Address" value={order.delivery_address} fullWidth />
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/product/${order.listing?.id}`}
                      className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-0.5 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'text-neutral-400',
    accepted: 'text-black',
    cancelled: 'text-neutral-500 line-through',
    delivered: 'text-black'
  };
  return (
    <span className={`text-[10px] tracking-[0.4em] uppercase font-medium ${styles[status] || 'text-neutral-500'}`}>
      {status}
    </span>
  );
};

const OrderDetail = ({ label, value, fullWidth = false, isStatus = false }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
      {label}
    </p>
    {isStatus ? (
      <StatusBadge status={value} />
    ) : (
      <p className="text-sm font-light uppercase tracking-wide">{value || '—'}</p>
    )}
  </div>
);

export default MyOrders;