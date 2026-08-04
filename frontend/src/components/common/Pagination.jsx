// components/common/Pagination.jsx
function Pagination({ page, totalPages, hasNext, hasPrevious, onPrevious, onNext, loading = false }) {
    if (totalPages <= 1) return null; // nothing to paginate

    return (
        <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-neutral-100">
            <button
                onClick={onPrevious}
                disabled={!hasPrevious || loading}
                className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors disabled:text-neutral-200 disabled:cursor-not-allowed"
            >
                ← Previous
            </button>

            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Page {page} of {totalPages}
            </span>

            <button
                onClick={onNext}
                disabled={!hasNext || loading}
                className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors disabled:text-neutral-200 disabled:cursor-not-allowed"
            >
                Next →
            </button>
        </div>
    );
}

export default Pagination;