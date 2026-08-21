import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

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
  value = "",
  onSearch,
  placeholder = "Search...",
  debounceMs = 500,
  disabled = false,
  className = "",
  showClearButton = true,
}: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState(value);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(searchInput);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchInput, debounceMs]);

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400/80 pointer-events-none transition-colors" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-400/80 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          aria-label="Search"
        />
        {showClearButton && searchInput && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;