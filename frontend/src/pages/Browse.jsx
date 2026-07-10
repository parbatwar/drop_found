import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../api/listings";

function Browse() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        section: "All",
        size: "",
        sort: "newest",
    });

    const categories = [
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
                category: filters.category || undefined,
                section:
                    filters.section === "All"
                        ? undefined
                        : filters.section.toLowerCase(),
                size: filters.size || undefined,
                sort: filters.sort,
            };
            const res = await getListings(params);
            setListings(res.data);
        } catch (error) {
        console.error("Failed to fetch listings:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
        fetchListings();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    return (
        <div className="min-h-screen bg-white text-gray-900 px-4 py-8 md:px-8">
        {/* Header & Controls */}
        <div className="max-w-7xl mx-auto mb-12">
            <h1 className="text-4xl font-light mb-8 tracking-tight">Drop Found</h1>
            
            <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <span className="absolute left-3 top-3 text-gray-400">
                    🔍
                </span>
                <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:border-black transition-colors"
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {["All", "Thrift", "Surplus"].map((s) => (
                <button
                    key={s}
                    onClick={() => setFilters({ ...filters, section: s })}
                    className={`px-6 py-3 border whitespace-nowrap ${filters.section === s ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-900"}`}
                >
                    {s}
                </button>
                ))}
            </div>
            </div>

            {/* Secondary Filters */}
            <div className="flex flex-wrap gap-4 mt-6 items-center">
                <select
                className="border border-gray-200 py-2 px-4 focus:outline-none"
                value={filters.category}
                onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                }
                >
                <option value="">Category</option>

                {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                    {c.label}
                    </option>
                ))}
                </select>

                <select
                className="border border-gray-200 py-2 px-4 focus:outline-none"
                value={filters.size}
                onChange={(e) =>
                    setFilters({ ...filters, size: e.target.value })
                }
                >
                <option value="">Size</option>

                {sizes.map((s) => (
                    <option key={s.value} value={s.value}>
                    {s.label}
                    </option>
                ))}
                </select>

                <select
                    value={filters.sort}
                    onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                    }
                    >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </div>

        {/* Grid */}
        <main className="max-w-7xl mx-auto">
            {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
            ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {listings.map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    <img
                        src={item.images?.[0]?.image_url}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-[10px] uppercase tracking-widest font-bold">
                        {item.section}
                    </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:underline underline-offset-4">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">NPR {Number(item.price).toLocaleString()}</p>
                </Link>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <div className="text-4xl mb-4 opacity-20">
                    📦
                </div>
                <p>No items found matching your criteria.</p>
            </div>
            )}
        </main>
        </div>
    );
}

export default Browse;