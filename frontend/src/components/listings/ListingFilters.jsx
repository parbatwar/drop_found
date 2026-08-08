/**
 * ListingFilters - Slide-out filter drawer component
 * 
 * A full-height drawer that slides in from the left side with filter options.
 * Handles filtering by category, gender, size, color, search, and sorting.
 * Fetches categories dynamically from the API.
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects from API
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {Function} props.onClose - Callback to close the drawer
 * @param {Boolean} props.showSellerTypeFilter - Whether to show seller type filter
 * @param {Boolean} props.showGenderFilter - Whether to show gender filter
 * 
 * @example
 * <ListingFilters
 *   categories={categories}
 *   filters={filters}
 *   onFilterChange={handleFilterChange}
 *   onClearFilters={clearFilters}
 *   onClose={() => setIsFilterOpen(false)}
 *   showSellerTypeFilter={true}
 *   showGenderFilter={true}
 * />
 */
function ListingFilters({ 
    categories, 
    filters, 
    onFilterChange, 
    onClearFilters, 
    onClose, 
    showSellerTypeFilter = false,
    showGenderFilter = true 
}) {
    const sizes = [
        { label: "XS", value: "xs" },
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl" },
        { label: "XXL", value: "xxl" },
        { label: "Free Size", value: "free_size" },
    ];

    const genders = [
        { label: "Men", value: "men" },
        { label: "Women", value: "women" },
        { label: "Kids", value: "kids" },
        { label: "Unisex", value: "unisex" },
    ];

    const sellerTypes = [
        { label: "All", value: "" },
        { label: "Thrift", value: "thrift" },
        { label: "Brand New", value: "retail_shop" },
    ];

    // Colors for future use
    const colors = [
        { label: "Black", value: "black" },
        { label: "White", value: "white" },
        { label: "Blue", value: "blue" },
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Yellow", value: "yellow" },
        { label: "Brown", value: "brown" },
        { label: "Gray", value: "gray" },
        { label: "Navy", value: "navy" },
    ];

    // Check if a filter value is active
    const isActive = (filterKey, value) => {
        if (value === '') {
            return !filters[filterKey] || filters[filterKey] === '';
        }
        return filters[filterKey] === value;
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/20 z-40" 
                onClick={onClose} 
            />
            
            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-50 p-8 shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-light tracking-tight text-black">
                        Filters
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-neutral-400 hover:text-black transition-colors"
                        aria-label="Close filters"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-8">
                    {/* Search */}
                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-2 block">
                            Search
                        </label>
                        <div className="relative">
                            <input 
                                className="w-full border-b border-neutral-200 py-2.5 pl-8 text-sm focus:border-black outline-none transition-colors bg-transparent" 
                                value={filters.search || ''} 
                                onChange={(e) => onFilterChange('search', e.target.value)} 
                                placeholder="Search by product name..." 
                            />
                            <svg className="w-4 h-4 text-neutral-400 absolute left-0 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1.5">
                            Searches product titles only
                        </p>
                    </div>

                    {/* Seller Type Filter - Shows on Men/Women pages */}
                    {showSellerTypeFilter && (
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                Seller Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sellerTypes.map((s) => (
                                    <button 
                                        key={s.value} 
                                        onClick={() => onFilterChange('seller_type', s.value)} 
                                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                            isActive('seller_type', s.value)
                                                ? "bg-black text-white border-black" 
                                                : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gender Filter - Shows on Thrift/Brand pages */}
                    {showGenderFilter && (
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                Gender
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => onFilterChange('gender', '')} 
                                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                        isActive('gender', '')
                                            ? "bg-black text-white border-black" 
                                            : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                    }`}
                                >
                                    All
                                </button>
                                {genders.map((g) => (
                                    <button 
                                        key={g.value} 
                                        onClick={() => onFilterChange('gender', g.value)} 
                                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                            isActive('gender', g.value)
                                                ? "bg-black text-white border-black" 
                                                : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category */}
                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => onFilterChange('category_id', '')} 
                                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                    isActive('category_id', '')
                                        ? "bg-black text-white border-black" 
                                        : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => onFilterChange('category_id', String(cat.id))} 
                                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                        isActive('category_id', String(cat.id))
                                            ? "bg-black text-white border-black" 
                                            : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                            Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => onFilterChange('size', '')} 
                                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                    isActive('size', '')
                                        ? "bg-black text-white border-black" 
                                        : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                }`}
                            >
                                All
                            </button>
                            {sizes.map((s) => (
                                <button 
                                    key={s.value} 
                                    onClick={() => onFilterChange('size', s.value)} 
                                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                        isActive('size', s.value)
                                            ? "bg-black text-white border-black" 
                                            : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color (Optional - uncomment when ready) */}
                    {/* {showColorFilter && (
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => onFilterChange('color', '')} 
                                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md ${
                                        isActive('color', '')
                                            ? "bg-black text-white border-black" 
                                            : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                    }`}
                                >
                                    All
                                </button>
                                {colors.map((c) => (
                                    <button 
                                        key={c.value} 
                                        onClick={() => onFilterChange('color', c.value)} 
                                        className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 rounded-md flex items-center gap-2 ${
                                            isActive('color', c.value)
                                                ? "bg-black text-white border-black" 
                                                : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                        }`}
                                    >
                                        <span 
                                            className="w-3 h-3 rounded-full border border-neutral-300"
                                            style={{ backgroundColor: c.value }}
                                        />
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Clear All */}
                    <button 
                        onClick={onClearFilters}
                        className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors border-t border-neutral-100 pt-6 w-full text-center"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>
        </>
    );
}

export default ListingFilters;