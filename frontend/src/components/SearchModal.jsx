// components/SearchModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '../api/listings';
import { Icons } from './Icons';

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
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Handle search debounce
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
            const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            
            navigate(`/browse?search=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    const handleClearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with smooth fade */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Wrapper */}
            <div className="relative min-h-screen px-4 py-8 md:py-16 flex items-start justify-center">
                <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden z-10 animate-slideDown">
                    
                    {/* Header / Search Input Bar */}
                    <form onSubmit={handleSearch} className="relative flex items-center border-b border-neutral-100 px-6 py-4">
                        <svg 
                            className="w-5 h-5 text-neutral-400 flex-shrink-0 mr-3"
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search products, shops, or categories..."
                            className="w-full text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent font-normal"
                        />

                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="mr-3 text-xs text-neutral-400 hover:text-neutral-700 transition-colors uppercase font-medium tracking-wider"
                            >
                                Clear
                            </button>
                        )}
                        
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
                        >
                            <Icons.X className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Results / Suggestions Container */}
                    <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-neutral-400 tracking-wider uppercase font-medium">Searching...</span>
                            </div>
                        ) : query.length >= 2 && results.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold px-2 mb-3">
                                    Products ({results.length})
                                </p>
                                {results.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/product/${item.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-2xl transition-all duration-200 group"
                                    >
                                        {/* Image thumbnail */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/60">
                                            {item.images?.[0] ? (
                                                <img 
                                                    src={item.images[0].image_url} 
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[9px] uppercase">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                                                <span className="truncate">{item.shop_name}</span>
                                                <span>•</span>
                                                <span className="capitalize">{item.category_name}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Price */}
                                        <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                                            NPR {Number(item.price).toLocaleString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : query.length >= 2 && results.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-neutral-900">No results found for "{query}"</p>
                                <p className="text-xs text-neutral-500 mt-1">Check your spelling or try searching for something else.</p>
                            </div>
                        ) : query.length === 0 && recentSearches.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between px-2 mb-3">
                                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                                        Recent Searches
                                    </p>
                                    <button 
                                        onClick={handleClearRecent}
                                        className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setQuery(term);
                                                performSearch(term);
                                            }}
                                            className="px-4 py-2 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-900 hover:text-white transition-colors duration-200"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-neutral-400 text-xs font-normal">
                                Type at least 2 characters to search products or categories.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchModal;