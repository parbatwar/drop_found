import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../api/listings";

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

    // Color swatches component
    const ColorSwatches = () => (
        <div className="flex gap-1.5 mt-2">
            <div className="w-3 h-3 rounded-full bg-neutral-300 border border-neutral-200" />
            <div className="w-3 h-3 rounded-full bg-stone-700 border border-neutral-200" />
            <div className="w-3 h-3 rounded-full bg-neutral-100 border border-neutral-200" />
        </div>
    );

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-neutral-100" />
            <div className="flex gap-1.5 mt-2">
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
            </div>
            <div className="h-3 bg-neutral-100 w-2/3" />
            <div className="h-3 bg-neutral-100 w-1/3" />
        </div>
    );

    return (
        <div className="bg-white min-h-screen text-neutral-900 pb-20">
            {/* Hero Section - Compact */}
            <section className="border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium block mb-1">
                        Explore
                    </span>
                    <h1 className="text-3xl md:text-4xl font-light tracking-[0.08em] leading-[1.15] text-black">
                        Collection
                    </h1>
                    <p className="text-neutral-500 text-sm mt-2 max-w-lg">
                        Hand-picked essentials and seasonal favorites from Nepal's finest curators.
                    </p>
                </div>
            </section>

            {/* Minimal Filter Bar - Single button */}
            <div className="border-b border-neutral-100 sticky top-0 bg-white z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:text-neutral-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0-4v2m0 6V4" />
                        </svg>
                        Filter and Sort
                    </button>
                    <span className="text-[10px] tracking-widest text-neutral-400">
                        {!loading && `${listings.length} Products`}
                    </span>
                </div>
            </div>

            {/* Slide-over Filter Panel */}
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/20 z-40" 
                        onClick={() => setIsFilterOpen(false)} 
                    />
                    
                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white z-50 p-8 shadow-2xl overflow-y-auto transition-transform">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-light tracking-[0.08em]">Filters</h2>
                            <button 
                                onClick={() => setIsFilterOpen(false)}
                                className="text-neutral-400 hover:text-black transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-8">
                            {/* Search */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2 block">
                                    Search
                                </label>
                                <input 
                                    className="w-full border-b border-neutral-200 py-2 text-sm focus:border-black outline-none transition-colors" 
                                    value={filters.search} 
                                    onChange={(e) => setFilters({...filters, search: e.target.value})} 
                                    placeholder="Search items..." 
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3 block">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(c => (
                                        <button 
                                            key={c.value} 
                                            onClick={() => setFilters({...filters, category: c.value})} 
                                            className={`px-3 py-1.5 text-xs border transition-colors ${
                                                filters.category === c.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 hover:border-black"
                                            }`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3 block">
                                    Section
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["All", "Thrift", "Surplus"].map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => setFilters({...filters, section: s})} 
                                            className={`px-3 py-1.5 text-xs border transition-colors ${
                                                filters.section === s 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 hover:border-black"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3 block">
                                    Size
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(s => (
                                        <button 
                                            key={s.value} 
                                            onClick={() => setFilters({...filters, size: filters.size === s.value ? "" : s.value})} 
                                            className={`px-3 py-1.5 text-xs border transition-colors ${
                                                filters.size === s.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 hover:border-black"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3 block">
                                    Sort By
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Newest", value: "newest" },
                                        { label: "Price: Low", value: "price_asc" },
                                        { label: "Price: High", value: "price_desc" },
                                    ].map(s => (
                                        <button 
                                            key={s.value} 
                                            onClick={() => setFilters({...filters, sort: s.value})} 
                                            className={`px-3 py-1.5 text-xs border transition-colors ${
                                                filters.sort === s.value 
                                                    ? "bg-black text-white border-black" 
                                                    : "border-neutral-200 hover:border-black"
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
                                className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors border-t border-neutral-100 pt-6 w-full text-center"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Product Grid - 4 columns */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {listings.map((item) => (
                            <Link to={`/product/${item.id}`} key={item.id} className="group block">
                                <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 overflow-hidden relative">
                                    <img
                                        src={item.images?.[0]?.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {item.section && (
                                        <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-medium bg-white text-black border border-neutral-100">
                                            {item.section}
                                        </span>
                                    )}
                                </div>
                                <ColorSwatches />
                                <h3 className="text-sm font-light tracking-wide text-neutral-800 mt-3 group-hover:underline underline-offset-4 transition-all">
                                    {item.title}
                                </h3>
                                <p className="text-sm font-medium text-neutral-900 mt-1">
                                    NPR {Number(item.price).toLocaleString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-neutral-50 border border-neutral-100">
                        <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-sm tracking-wider">No items found</p>
                        <p className="text-xs mt-1 text-neutral-300">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <section className="bg-neutral-50 py-16 border-t border-neutral-100">
                <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 block">Curated for You</span>
                    <h2 className="text-xl font-light tracking-[0.1em] text-black uppercase">
                        Discover Your Style
                    </h2>
                    <p className="text-neutral-500 text-xs max-w-xl mx-auto leading-relaxed">
                        From vintage finds to contemporary essentials — find your next signature look.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link
                            to="/thrift"
                            className="bg-black text-white px-8 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors duration-300"
                        >
                            Shop Thrift
                        </Link>
                        <Link
                            to="/surplus"
                            className="border border-neutral-300 px-8 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                        >
                            Shop Surplus
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Browse;