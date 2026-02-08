// components/ui/table/sort-select.tsx
interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  sortOptions: SortOption[];
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  disabled?: boolean;
  className?: string;
  showLabels?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const SortSelect = ({
  sortBy,
  sortOrder,
  sortOptions,
  onSortChange,
  disabled = false,
  className = '',
  showLabels = true,
  layout = 'horizontal',
}: SortSelectProps) => {
  const containerClass = layout === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-4';

  return (
    <div className={`${containerClass} ${className}`}>
      {/* Sort By */}
      <div className="flex flex-col gap-1 flex-1">
        {showLabels && (
          <label className="text-sm text-gray-400 font-medium">
            Sort By
          </label>
        )}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          disabled={disabled}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sort by"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex flex-col gap-1">
        {showLabels && (
          <label className="text-sm text-gray-400 font-medium">
            Order
          </label>
        )}
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(sortBy, e.target.value as 'asc' | 'desc')}
          disabled={disabled}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sort order"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortSelect;