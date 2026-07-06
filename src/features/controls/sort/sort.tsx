import { useState } from 'react';


export type SortOption<T = string> = {
  label: string;
  value: T;
};

export type SortOrder = 'asc' | 'desc';

export type SortConfig<T = string> = {
  field: T;
  order: SortOrder;
};

interface SortDropdownProps<T = string> {
  options: SortOption<T>[];
  value?: SortConfig<T>;
  onSortChange: (sort: SortConfig<T>) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const SortDropdown = <T extends string>({
  options,
  value,
  onSortChange,
  disabled = false,
  className = '',
  placeholder = 'Sort by...',
}: SortDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<T | undefined>(value?.field);
  const [sortOrder, setSortOrder] = useState<SortOrder>(value?.order || 'asc');

  const handleFieldSelect = (field: T) => {
    setSelectedField(field);
    const newSort: SortConfig<T> = {
      field,
      order: sortOrder,
    };
    onSortChange(newSort);
    setIsOpen(false);
  };

  const toggleSortOrder = () => {
    const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    if (selectedField) {
      onSortChange({
        field: selectedField,
        order: newOrder,
      });
    }
  };

  const handleClear = () => {
    setSelectedField(undefined);
    setSortOrder('asc');
    onSortChange({
      field: '' as T,
      order: 'asc',
    });
  };

  const getSelectedLabel = () => {
    if (!selectedField) return placeholder;
    const option = options.find((opt) => opt.value === selectedField);
    return option?.label || placeholder;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        {/* Sort Field Dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white text-left focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
          >
            <span className={selectedField ? 'text-white' : 'text-gray-400'}>
              {getSelectedLabel()}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Sort Icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>

          {/* Dropdown Options */}
          {isOpen && !disabled && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFieldSelect(option.value)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                    selectedField === option.value
                      ? 'bg-gray-700 text-blue-400'
                      : 'text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Order Toggle Button */}
        {selectedField && (
          <button
            onClick={toggleSortOrder}
            disabled={disabled}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            )}
          </button>
        )}

        {/* Clear Button */}
        {selectedField && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear sort"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};




export default SortDropdown;