import { useState, useEffect } from "react";
import { getMyOrders } from "../../api/orders";
import { createReview } from "../../api/reviews";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);

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

  const handleSubmitReview = async () => {
    if (reviewData.rating === 0) {
      alert("Please select a rating");
      return;
    }
    try {
        // Sending payload as per ReviewCreate schema
        await createReview(
        selectedOrder.id,
        {
            rating: reviewData.rating,
            comment: reviewData.comment,
        }
        );
      
        setShowReviewModal(false);
        setSelectedOrder(null);
        setHoveredRating(0);
        setReviewData({ rating: 0, comment: "" });
        loadOrders(); // Refresh to update the UI with '✓ Reviewed'
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit review");
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="border-b border-neutral-200 pb-6 mb-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mb-1">Account</p>
            <h1 className="text-3xl md:text-4xl font-light tracking-[0.08em] uppercase">My Orders</h1>
          </div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400">{orders.length} orders</span>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="bg-neutral-50 border-l-2 border-black p-6 text-[10px] uppercase tracking-wide text-neutral-600">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="group border-b border-neutral-100 hover:border-neutral-300 transition-colors duration-200 pb-4 last:border-0">
              <div className="flex items-center gap-5 py-3">
                <div className="w-14 h-18 flex-shrink-0 overflow-hidden bg-neutral-50">
                  <img src={order.listing?.images?.[0]?.image_url} alt={order.listing?.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <h2 className="text-sm font-light uppercase tracking-wide truncate">{order.listing?.title || "Product"}</h2>
                  <p className="text-xs font-medium tracking-wide">NPR {Number(order.total_amount).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                <StatusBadge status={order.status} />

                {order.status === "delivered" && !order.review && (
                    <button
                    onClick={() => {
                        setSelectedOrder(order);
                        setShowReviewModal(true);
                    }}
                    className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-black border-b border-transparent hover:border-black"
                    >
                    Write Review
                    </button>
                )}

                {order.review && (
                    <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                        <span
                        key={star}
                        className={`text-sm ${
                            star <= order.review.rating
                            ? "text-black"
                            : "text-neutral-200"
                        }`}
                        >
                        ★
                        </span>
                    ))}
                    </div>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-md w-full">
            <h3 className="text-sm font-light uppercase tracking-wide mb-6">Write a Review</h3>
            
            <div className="mb-6">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setReviewData({...reviewData, rating: star})}
                    className="text-3xl focus:outline-none"
                  >
                    <span className={star <= (hoveredRating || reviewData.rating) ? 'text-black' : 'text-neutral-200'}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full border border-neutral-200 p-3 text-sm h-24 mb-6 focus:border-black transition-colors"
              placeholder="Share your experience..."
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 border py-3 text-[10px] uppercase tracking-widest">Cancel</button>
              <button onClick={handleSubmitReview} className="flex-1 bg-black text-white py-3 text-[10px] uppercase tracking-widest disabled:opacity-50" disabled={reviewData.rating === 0}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const StatusBadge = ({ status }) => {
  const styles = { pending: 'text-neutral-400', accepted: 'text-black', cancelled: 'text-neutral-400 line-through', delivered: 'text-neutral-600' };
  return <span className={`text-[10px] tracking-[0.4em] uppercase font-medium ${styles[status] || 'text-neutral-500'}`}>{status}</span>;
};

export default MyOrders;