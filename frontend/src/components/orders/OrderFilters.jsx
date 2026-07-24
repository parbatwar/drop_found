/**
 * @file OrderFilters.jsx
 * @description Component for filtering orders via a dropdown menu, showing current filter selections 
 * and dynamic order count badges for each status option.
 */

import { useState } from 'react';
import { ORDER_FILTER_OPTIONS, getFilterLabel } from '../../constants/orderStatus';

function OrderFilters({ selectedFilter, onFilterChange, getFilterCount }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const currentLabel = getFilterLabel(selectedFilter);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 text-xs border border-neutral-200 rounded hover:border-neutral-400 transition-colors"
            >
                <span className="text-neutral-500">Filter:</span>
                <span className="font-medium text-neutral-800">{currentLabel}</span>
                <svg className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {showDropdown && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded shadow-lg z-20 py-1">
                        {ORDER_FILTER_OPTIONS.map((option) => {
                            const count = getFilterCount?.(option.key) ?? 0;
                            return (
                                <button
                                    key={option.key}
                                    onClick={() => {
                                        onFilterChange(option.key);
                                        setShowDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                                        selectedFilter === option.key ? 'bg-neutral-50 text-black' : 'text-neutral-600'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    <span className="text-neutral-400 text-[10px]">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderFilters;