import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { getListings } from '../../api/listings';
import { getCategories } from '../../api/category';
import ListingCard from '../../components/listings/ListingCard';
import ListingGrid from '../../components/listings/ListingGrid';
import ListingFilters from '../../components/listings/ListingFilters';
import Pagination from '../../components/common/Pagination';

function Browse() {
    const [searchParams] = useSearchParams();  // ← NEW
    const initialSearch = searchParams.get('search') || '';  // ← NEW

    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // ✅ Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [total, setTotal] = useState(0);

    const [filters, setFilters] = useState({
        search: initialSearch,
        // search: "",
        category_id: "",
        seller_type: "",
        gender: "",
        size: "",
        color: "",
        sort: "newest",
    });

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data || []))
            .catch(err => console.error('Failed to fetch categories:', err));
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = {
                search: filters.search || undefined,
                category_id: filters.category_id || undefined,
                seller_type: filters.seller_type || undefined,
                gender: filters.gender || undefined,
                size: filters.size || undefined,
                color: filters.color || undefined,
                sort: filters.sort,
                page: page,
                limit: 20,
            };
            const res = await getListings(params);
            const data = res.data;

            // ✅ Unwrap paginated response
            setListings(data.items || []);
            setTotal(data.total || 0);
            setTotalPages(data.total_pages || 1);
            setHasNext(data.has_next || false);
            setHasPrevious(data.has_previous || false);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(fetchListings, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filters, page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            category_id: "",
            seller_type: "",
            gender: "",
            size: "",
            color: "",
            sort: "newest",
        });
        setPage(1);
    };

    const handleNextPage = () => setPage(p => p + 1);
    const handlePreviousPage = () => setPage(p => Math.max(1, p - 1));

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.category_id) count++;
        if (filters.seller_type) count++;
        if (filters.gender) count++;
        if (filters.size) count++;
        if (filters.color) count++;
        if (filters.sort !== "newest") count++;
        return count;
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                        Explore
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                        All Collection
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2 max-w-lg leading-relaxed">
                        Hand-picked essentials and seasonal favorites from Nepal's finest curators.
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="border-b border-neutral-100 sticky top-0 bg-white z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4" />
                        </svg>
                        Filters
                        {getActiveFilterCount() > 0 && (
                            <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] bg-black text-white rounded-full">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </button>
                    <span className="text-[10px] tracking-wider text-neutral-400">
                        {!loading && `${total} items`}
                    </span>
                </div>
            </div>

            {/* Filter Drawer */}
            {isFilterOpen && (
                <ListingFilters
                    categories={categories}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    onClose={() => setIsFilterOpen(false)}
                    showSellerTypeFilter={true}
                />
            )}

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                {loading ? (
                    <ListingGrid.Loading count={8} />
                ) : listings.length > 0 ? (
                    <>
                        <ListingGrid>
                            {listings.map((item) => (
                                <ListingCard key={item.id} listing={item} />
                            ))}
                        </ListingGrid>

                        {/* ✅ Pagination Component */}
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                            onPrevious={handlePreviousPage}
                            onNext={handleNextPage}
                            loading={loading}
                        />
                    </>
                ) : (
                    <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                        <div className="text-4xl font-light text-neutral-300 mb-4">🔍</div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">No items found</p>
                        <p className="text-[10px] text-neutral-300 mt-2">Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={clearFilters}
                            className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <section className="bg-neutral-50 py-16 border-t border-neutral-100">
                <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block">
                        Curated for You
                    </span>
                    <h2 className="text-xl font-light tracking-[0.1em] text-black uppercase">
                        Discover Your Style
                    </h2>
                    <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        From vintage finds to contemporary essentials — find your next signature look.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/thrift"
                            className="bg-black text-white px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                        >
                            Shop Thrift
                        </Link>
                        <Link
                            to="/brand-new"
                            className="border border-neutral-300 px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                        >
                            Shop Brand New
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Browse;