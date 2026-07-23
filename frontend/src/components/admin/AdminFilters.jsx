// frontend/src/components/admin/AdminFilters.jsx
import { useState } from 'react';

function AdminFilters({ 
    filters,           
    onFilterChange,
    onSearch,
    onClear,
    searchPlaceholder = 'Search...',
    showSearch = true,
    className = '',
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({});

    const handleFilterChange = (key, value) => {
        // ✅ Ensure we're setting the correct value
        const newFilters = { ...activeFilters, [key]: value };
        setActiveFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setSearchQuery('');
        setActiveFilters({});
        onClear?.();
    };

    const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== 'all') || searchQuery;

    return (
        <div className={`flex flex-wrap items-center gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-lg ${className}`}>
            {/* Search */}
            {showSearch && (
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border-b border-neutral-300 px-0 py-1.5 text-sm focus:border-black outline-none transition-colors bg-transparent placeholder:text-neutral-400"
                    />
                </div>
            )}

            {/* Filters */}
            {filters.map((filter) => (
                <select
                    key={filter.key}
                    value={activeFilters[filter.key] || filter.defaultValue || 'all'}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="border-b border-neutral-300 px-0 py-1.5 text-sm focus:border-black outline-none transition-colors bg-transparent min-w-[120px]"
                >
                    {/* ✅ Use filter.label as the default option label */}
                    <option value="all">{filter.label || 'All'}</option>
                    {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ))}

            {/* Clear Button */}
            {hasActiveFilters && (
                <button
                    onClick={handleClear}
                    className="text-[10px] text-neutral-400 hover:text-black transition-colors uppercase tracking-wider ml-auto"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}

export default AdminFilters;