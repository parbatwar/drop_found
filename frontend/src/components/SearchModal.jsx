import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '../api/listings';
import { Icons } from './Icons';
import LoadingSpinner from './common/LoadingSpinner';

function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const res = await getListings({
                search: searchQuery,
                limit: 10,
                page: 1,
            });
            setResults(res.data?.items || []);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Save to recent searches
            const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            
            // Navigate to browse with search query
            navigate(`/browse?search=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 z-50"
                onClick={onClose}
            />
            
            {/* Search Modal */}
            <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-xl animate-slideDown">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search for products, shops, categories..."
                            className="w-full border-b-2 border-black px-4 py-4 pl-12 text-lg focus:outline-none bg-transparent"
                            autoFocus
                        />
                        <svg 
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                        >
                            <Icons.X className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Results */}
                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                                    Searching...
                                </div>
                            </div>
                        ) : query.length >= 2 && results.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {results.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/product/${item.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 py-4 hover:bg-neutral-50 transition-colors px-2 rounded-sm"
                                    >
                                        {/* Image */}
                                        <div className="w-14 h-14 flex-shrink-0 bg-neutral-50 border border-neutral-100 overflow-hidden rounded-sm">
                                            {item.images?.[0] ? (
                                                <img 
                                                    src={item.images[0].image_url} 
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[8px] uppercase tracking-wider">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-800 truncate">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-neutral-400">
                                                <span>{item.shop_name}</span>
                                                <span className="w-px h-3 bg-neutral-200" />
                                                <span className="capitalize">{item.category_name}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Price */}
                                        <p className="text-sm font-medium text-neutral-900 flex-shrink-0">
                                            NPR {Number(item.price).toLocaleString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : query.length >= 2 && results.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl font-light text-neutral-300 mb-4">🔍</div>
                                <p className="text-sm text-neutral-400">No results found for "{query}"</p>
                                <p className="text-[10px] text-neutral-300 mt-1">Try different keywords</p>
                            </div>
                        ) : query.length === 0 && recentSearches.length > 0 ? (
                            <div className="py-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium mb-3">
                                    Recent Searches
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setQuery(term);
                                                performSearch(term);
                                            }}
                                            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-full hover:border-black hover:bg-black hover:text-white transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Search Tip */}
                    {query.length === 0 && (
                        <div className="mt-4 text-[10px] text-neutral-400 uppercase tracking-wider border-t border-neutral-100 pt-4">
                            Search for products, shops, or categories
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SearchModal;