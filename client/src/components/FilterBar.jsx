import React from 'react';
import { Calendar, Filter } from 'lucide-react';

const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filterOptions = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week (Last 7 Days)' },
    { id: 'last_week', label: 'Last Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center space-x-2 text-slate-600 text-xs font-bold uppercase tracking-wider pl-1">
        <Filter className="w-4 h-4 text-blue-600" />
        <span>Date Filter:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onFilterChange(opt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
