import { useEffect, useState } from "react";
import { getSellerOrders, updateOrderStatus } from "../../api/orders";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6 mb-12">
        <h1 className="text-3xl font-light tracking-[0.08em] uppercase text-black">
          Order Ledger
        </h1>
        <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mt-2">
          {orders.length} Active Records
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral-50 border-l-2 border-black p-6 text-[10px] uppercase tracking-widest text-neutral-600">
          No orders currently in queue.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                {["Product", "Buyer", "Phone", "Payment", "Total", "Status", ""].map((head) => (
                  <th key={head} className="py-4 px-2 text-[10px] tracking-widest uppercase text-neutral-500 font-medium whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-neutral-50/70 transition-colors duration-300">
                  {/* Product */}
                  <td className="py-5 pr-8 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img
                          src={order.listing.images?.[0]?.image_url}
                          alt={order.listing.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-sm font-light uppercase tracking-wide">{order.listing.title}</span>
                    </div>
                  </td>

                  {/* Buyer */}
                  <td className="py-5 px-2 text-[11px] uppercase tracking-[0.05em] text-neutral-700">{order.buyer.first_name} {order.buyer.last_name}</td>

                  {/* Phone */}
                  <td className="py-5 px-2 text-[11px] uppercase tracking-widest text-neutral-500">{order.receiver_phone}</td>

                  {/* Payment */}
                  <td className="py-5 px-2 text-[11px] uppercase tracking-widest text-neutral-500">{order.payment_method}</td>

                  {/* Total */}
                  <td className="py-5 px-2 text-sm font-medium tracking-wide">NPR {Number(order.total_amount).toLocaleString()}</td>

                  {/* Status */}
                  <td className="py-5 px-2">
                    <span className={`text-[10px] tracking-[0.3em] uppercase ${order.status === 'pending' ? 'text-neutral-400' : 'text-black'}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-5 pl-4 text-right">
                    {order.status === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleStatusUpdate(order.id, "accepted")}
                          className="px-4 py-2.5 bg-black text-white text-[10px] tracking-widest uppercase hover:bg-neutral-800 rounded-sm transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, "cancelled")}
                          className="px-4 py-2.5 border border-neutral-200 text-[10px] tracking-widest uppercase hover:border-black rounded-sm transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SellerOrders;