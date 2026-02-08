
interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll?: () => void;
  className?: string;
  showClearAll?: boolean;
}

const ActiveFilters = ({
  filters,
  onClearAll,
  className = '',
  showClearAll = true,
}: ActiveFiltersProps) => {
  if (filters.length === 0) return null;

  return (
    <div className={`flex gap-2 items-center flex-wrap ${className}`}>
      <span className="text-sm text-gray-400">Active filters:</span>
      
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="px-3 py-1 bg-blue-600 rounded-full text-sm flex items-center gap-2"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={filter.onRemove}
            className="hover:text-gray-300 font-bold text-lg leading-none"
            aria-label={`Remove ${filter.label} filter`}
          >
            ×
          </button>
        </span>
      ))}
      
      {showClearAll && onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-red-400 hover:text-red-300 underline"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;