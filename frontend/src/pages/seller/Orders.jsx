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
      alert(err.response?.data?.detail || "Failed to update order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "accepted":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "cancelled":
        return "text-neutral-400";
      default:
        return "text-black";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6 mb-12">
        <h1 className="text-3xl font-light tracking-[0.08em] uppercase">
          Seller Orders
        </h1>

        <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mt-2">
          {orders.length} Orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral-50 border-l-2 border-black p-6">
          <p className="text-[10px] uppercase tracking-[0.3em]">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Product
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Buyer
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Phone
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Address
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Payment
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Total
                </th>

                <th className="py-4 text-left text-[10px] uppercase tracking-[0.3em]">
                  Status
                </th>

                <th className="py-4 text-right text-[10px] uppercase tracking-[0.3em]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  {/* Product */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-neutral-100 overflow-hidden flex-shrink-0">
                        <img
                          src={order.listing?.images?.[0]?.image_url}
                          alt={order.listing?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium uppercase">
                          {order.listing?.title}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Buyer */}
                  <td className="py-5 text-sm">
                    {order.buyer?.first_name} {order.buyer?.last_name}
                  </td>

                  {/* Phone */}
                  <td className="py-5 text-sm">
                    {order.receiver_phone}
                  </td>

                  {/* Address */}
                  <td className="py-5 text-sm max-w-xs">
                    {order.delivery_address}
                  </td>

                  {/* Payment */}
                  <td className="py-5 text-sm uppercase">
                    {order.payment_method}
                  </td>

                  {/* Total */}
                  <td className="py-5 font-medium">
                    NPR {Number(order.total_amount).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="py-5">
                    <span
                      className={`text-[10px] uppercase tracking-[0.3em] font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-5">
                    <div className="flex justify-end gap-2">

                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "accepted")
                            }
                            className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "rejected")
                            }
                            className="px-4 py-2 border border-neutral-300 text-[10px] uppercase tracking-[0.2em] hover:border-black"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === "accepted" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "delivered")
                          }
                          className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800"
                        >
                          Mark Delivered
                        </button>
                      )}

                      {(order.status === "delivered" ||
                        order.status === "rejected" ||
                        order.status === "cancelled") && (
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                          Completed
                        </span>
                      )}
                    </div>
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