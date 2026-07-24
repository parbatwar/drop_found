/**
 * @file ReviewModal.jsx
 * @description Component for displaying a modal interface where users can write product reviews, 
 * select star ratings with hover effects, add comments, and submit or cancel their feedback.
 */

import Modal from '../common/Modal';
import { Icons } from '../Icons';

function ReviewModal({ 
    isOpen, 
    onClose, 
    order, 
    reviewData, 
    hoveredRating,
    setReviewData,
    setHoveredRating,
    onSubmit,
    submitting 
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Write a Review" size="sm">
            <div className="space-y-6">
                <div>
                    <p className="text-sm font-medium text-neutral-800">
                        {order?.items?.[0]?.listing?.title || 'Product'}
                    </p>
                    <p className="text-xs text-neutral-400">
                        {order?.seller?.shop_name || 'Shop'}
                    </p>
                </div>
                
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setReviewData({...reviewData, rating: star})}
                            className="focus:outline-none"
                        >
                            <Icons.Star 
                                className={`w-7 h-7 ${
                                    star <= (hoveredRating || reviewData.rating) 
                                        ? 'text-amber-400 fill-amber-400' 
                                        : 'text-neutral-200'
                                }`}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full border-b border-neutral-200 px-0 py-2 text-sm text-black placeholder:text-neutral-300 focus:border-black outline-none transition-colors resize-none bg-transparent"
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                />
                
                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                    <button 
                        onClick={onClose}
                        className="flex-1 border border-neutral-200 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onSubmit}
                        disabled={reviewData.rating === 0 || submitting}
                        className="flex-1 bg-black text-white py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors duration-300 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ReviewModal;