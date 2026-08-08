import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getListings } from '../../api/listings';
import { getCategories } from '../../api/category'; 
import ListingCard from '../../components/listings/ListingCard';
import ListingGrid from '../../components/listings/ListingGrid';
import ListingFilters from '../../components/listings/ListingFilters';
import Pagination from '../../components/common/Pagination';

const sortOptions = [
    { value: 'newest', label: 'New Arrivals' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rated', label: 'Top Rated' },
];

function ListingsPage({ 
    sellerType,      
    title, 
    description, 
    gender,          
    categoryId,      
    hideSellerTypeFilter = false,
    hideGenderFilter = false,
    showColorFilter = false,
    initialSearch = "",
    heroBadge,
    emptyStateMessage = "No items found"
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    // Extract query parameters
    const currentSearch = searchParams.get('search') || initialSearch;
    const currentCategory = searchParams.get('category') || categoryId || '';
    const currentGender = searchParams.get('gender') || gender || '';
    const currentSize = searchParams.get('size') || '';
    const currentColor = searchParams.get('color') || '';
    const currentSort = searchParams.get('sort') || 'newest';
    
    // IMPORTANT: Get seller_type from URL (either 'type' or 'seller_type' param)
    const currentSellerType = searchParams.get('type') || searchParams.get('seller_type') || sellerType || '';

    const filters = {
        search: currentSearch,
        category_id: currentCategory,
        seller_type: currentSellerType,
        gender: currentGender,
        size: currentSize,
        color: currentColor,
        sort: currentSort,
    };

    // Fetch categories on mount
    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data || []))
            .catch(err => console.error('Failed to fetch categories:', err));
    }, []);

    // Fetch listings whenever search params or page changes
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                // Map 'thrift' to your backend's expected value
                let backendSellerType = currentSellerType;
                if (backendSellerType === 'thrift') {
                    backendSellerType = 'thrift_shop';
                }

                const apiParams = {
                    search: currentSearch || undefined,
                    category_id: currentCategory || undefined,
                    seller_type: backendSellerType || undefined,
                    gender: currentGender || undefined,
                    size: currentSize || undefined,
                    color: currentColor || undefined,
                    sort: currentSort,
                    page: page,
                    limit: 20,
                };
                
                // Remove undefined or empty values
                Object.keys(apiParams).forEach(key => {
                    if (apiParams[key] === undefined || apiParams[key] === '') {
                        delete apiParams[key];
                    }
                });
                
                console.log('📦 API Params:', apiParams); // Debug log
                
                const res = await getListings(apiParams);
                const data = res.data;

                setListings(data.items || []);
                setTotalPages(data.total_pages || 1);
                setHasNext(data.has_next || false);
                setHasPrevious(data.has_previous || false);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(fetchListings, 200);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParams, page]);

    const handleFilterChange = (key, value) => {
        const currentPath = location.pathname;
        const params = new URLSearchParams(searchParams);
        
        let paramKey = key;
        if (key === 'seller_type') paramKey = 'type';
        if (key === 'category_id') paramKey = 'category';

        // ✅ If value is empty string or null, remove the param (this is "All")
        if (value && value !== '') {
            params.set(paramKey, value);
        } else {
            params.delete(paramKey);
        }
        
        setPage(1); 
        
        const queryString = params.toString();
        navigate(`${currentPath}${queryString ? `?${queryString}` : ''}`, { replace: true });
    };

    const clearFilters = () => {
        const currentPath = location.pathname;
        navigate(currentPath, { replace: true });
        setPage(1);
    };

    const handleNextPage = () => setPage(p => p + 1);
    const handlePreviousPage = () => setPage(p => Math.max(1, p - 1));

    const getBadgeText = () => {
        if (filters.seller_type === 'thrift' || filters.seller_type === 'thrift_shop') return 'Thrift';
        if (filters.seller_type === 'retail_shop') return 'Retail Shop';
        if (filters.gender === 'men') return 'Men';
        if (filters.gender === 'women') return 'Women';
        if (filters.gender === 'unisex') return 'Unisex';
        if (filters.gender === 'kids') return 'Kids';
        return heroBadge || 'Collection';
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                    <div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                            {getBadgeText()}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black">
                            {title}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-2 max-w-lg leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="group inline-flex items-center gap-2 text-xs font-normal uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4" />
                        </svg>
                        <span>Filters</span>
                    </button>

                    <div className="relative flex items-center">
                        <div className="relative inline-flex items-center">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="appearance-none bg-transparent py-1.5 pl-3 pr-8 text-xs font-normal uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 rounded cursor-pointer transition-colors"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="text-neutral-900 normal-case bg-white">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            
                            {/* Down Arrow Icon */}
                            <div className="pointer-events-none absolute right-2 flex items-center text-neutral-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
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
                    showSellerTypeFilter={!hideSellerTypeFilter}
                    showGenderFilter={!hideGenderFilter}
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
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">{emptyStateMessage}</p>
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
        </div>
    );
}

export default ListingsPage;