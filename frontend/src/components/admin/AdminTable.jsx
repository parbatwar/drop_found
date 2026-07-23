// frontend/src/components/admin/AdminTable.jsx
import { useState } from 'react';

function AdminTable({ 
    columns,           // Array of column definitions
    data,              // Array of data rows
    loading = false,
    emptyMessage = 'No data found',
    onRowClick = null,
    actions = null,    // Render function for actions column
    renderCell = null, // Custom cell renderer
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                    Loading...
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="border border-neutral-200 bg-neutral-50 p-16 text-center rounded-lg">
                <div className="text-4xl font-light text-neutral-300 mb-3">📋</div>
                <p className="text-sm text-neutral-400 uppercase tracking-wider">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                        {columns.map((col, index) => (
                            <th 
                                key={index}
                                className={`px-4 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium ${col.className || ''}`}
                                style={{ width: col.width || 'auto' }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {data.map((row, rowIndex) => (
                        <tr 
                            key={rowIndex} 
                            className={`hover:bg-neutral-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={`px-4 py-3 ${col.cellClassName || ''}`}>
                                    {renderCell 
                                        ? renderCell(row, col.key, colIndex)
                                        : col.render 
                                            ? col.render(row)
                                            : row[col.key] ?? '—'
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminTable;