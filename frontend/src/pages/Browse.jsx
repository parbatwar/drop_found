// pages/Browse.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../api/listings";

// SVG Icons
const Icons = {
    Filter: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4" />
        </svg>
    ),
    X: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Search: ({ className = "w-4 h-4" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Grid: ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
};

function Browse() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        category: "All",
        section: "All",
        size: "",
        sort: "newest",
    });

    const categories = [
        { label: "All", value: "All" },
        { label: "Tops", value: "tops" },
        { label: "T-Shirts", value: "tshirts" },
        { label: "Shirts", value: "shirts" },
        { label: "Pants", value: "pants" },
        { label: "Dresses", value: "dresses" },
        { label: "Jackets", value: "jacket" },
        { label: "Footwear", value: "footwear" },
        { label: "Bags", value: "bags" },
        { label: "Accessories", value: "accessories" },
        { label: "Other", value: "other" },
    ];

    const sizes = [
        { label: "XS", value: "xs" },
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl" },
        { label: "XXL", value: "xxl" },
        { label: "Free Size", value: "free_size" },
    ];

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = {
                search: filters.search || undefined,
                category: filters.category === "All" ? undefined : filters.category,
                section: filters.section === "All" ? undefined : filters.section.toLowerCase(),
                size: filters.size || undefined,
                sort: filters.sort,
            };
            const res = await getListings(params);
            setListings(res.data || []);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(fetchListings, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-neutral-100" />
            <div className="h-3 bg-neutral-100 w-2/3" />
            <div className="h-3 bg-neutral-100 w-1/3" />
        </div>
    );

    // Get active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.category !== "All") count++;
        if (filters.section !== "All") count++;
        if (filters.size) count++;
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
                        Collection
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
                        <Icons.Filter className="w-3.5 h-3.5" />
                        Filters
                        {getActiveFilterCount() > 0 && (
                            <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] bg-black text-white rounded-full">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </button>
                    <span className="text-[10px] tracking-wider text-neutral-400">
                        {!loading && `${listings.length} items`}
                    </span>
                </div>
            </div>

            {/* Filter Drawer */}
            {isFilterOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/20 z-40" 
                        onClick={() => setIsFilterOpen(false)} 
                    />
                    
                    <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-50 p-8 shadow-2xl overflow-y-auto transition-transform animate-slideIn">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-light tracking-tight text-black">
                                Filters
                            </h2>
                            <button 
                                onClick={() => setIsFilterOpen(false)}
                                className="text-neutral-400 hover:text-black transition-colors"
                            >
                                <Icons.X />
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
                                        value={filters.search} 
                                        onChange={(e) => setFilters({...filters, search: e.target.value})} 
                                        placeholder="Search items..." 
                                    />
                                    <Icons.Search className="w-4 h-4 text-neutral-400 absolute left-0 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(c => (
                                        <button 
                                            key={c.value} 
                                            onClick={() => setFilters({...filters, category: c.value})} 
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 ${
                                                filters.category === c.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                            }`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                    Section
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["All", "Thrift", "Surplus"].map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => setFilters({...filters, section: s})} 
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 ${
                                                filters.section === s 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                            }`}
                                        >
                                            {s}
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
                                    {sizes.map(s => (
                                        <button 
                                            key={s.value} 
                                            onClick={() => setFilters({...filters, size: filters.size === s.value ? "" : s.value})} 
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 ${
                                                filters.size === s.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium mb-3 block">
                                    Sort By
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Newest", value: "newest" },
                                        { label: "Price: Low to High", value: "price_asc" },
                                        { label: "Price: High to Low", value: "price_desc" },
                                    ].map(s => (
                                        <button 
                                            key={s.value} 
                                            onClick={() => setFilters({...filters, sort: s.value})} 
                                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all duration-200 ${
                                                filters.sort === s.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear All */}
                            <button 
                                onClick={() => setFilters({
                                    search: "",
                                    category: "All",
                                    section: "All",
                                    size: "",
                                    sort: "newest",
                                })}
                                className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors border-t border-neutral-100 pt-6 w-full text-center"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {listings.map((item) => (
                            <Link to={`/product/${item.id}`} key={item.id} className="group block">
                                <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 overflow-hidden relative">
                                    {item.images?.[0]?.image_url ? (
                                        <img
                                            src={item.images[0].image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px] uppercase tracking-wider bg-neutral-50">
                                            No Image
                                        </div>
                                    )}
                                    {item.section && (
                                        <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-medium bg-white/90 text-black border border-neutral-100">
                                            {item.section}
                                        </span>
                                    )}
                                    {item.status === 'inactive' && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <span className="text-white text-[9px] uppercase tracking-widest bg-black/60 px-3 py-1">
                                                Unavailable
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-light text-neutral-800 mt-3 group-hover:text-black transition-colors truncate">
                                    {item.title}
                                </h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm font-medium text-neutral-900">
                                        NPR {Number(item.price).toLocaleString()}
                                    </p>
                                    {item.seller_type && (
                                        <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
                                            {item.seller_type}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="border border-neutral-200 bg-neutral-50 p-20 text-center">
                        <div className="text-4xl font-light text-neutral-300 mb-4">🔍</div>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">
                            No items found
                        </p>
                        <p className="text-[10px] text-neutral-300 mt-2">
                            Try adjusting your filters or search terms.
                        </p>
                        <button 
                            onClick={() => setFilters({
                                search: "",
                                category: "All",
                                section: "All",
                                size: "",
                                sort: "newest",
                            })}
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
                            to="/surplus"
                            className="border border-neutral-300 px-8 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                        >
                            Shop Surplus
                        </Link>
                    </div>
                </div>
            </section>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Browse;