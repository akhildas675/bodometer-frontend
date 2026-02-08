import { useState, useEffect } from 'react';

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
}

const SearchBar = ({
  value = '',
  onSearch,
  placeholder = "Search...",
  debounceMs = 500,
  disabled = false,
  className = '',
  showClearButton = true,
}: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchInput('');
    onSearch('');
  };

  return (
    <div className={`relative w-full ${className}`}> {/* Fixed: Use curly braces, not backtick */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Search"
      />
      
      {/* Search Icon */}
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      
      {/* Clear Button */}
      {showClearButton && searchInput && !disabled && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xl"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;