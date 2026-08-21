import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, ArrowUp, ArrowDown, X } from "lucide-react";

export type SortOption<T = string> = {
  label: string;
  value: T;
};

export type SortOrder = "asc" | "desc";

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
  className = "",
  placeholder = "Sort by...",
}: SortDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<T | undefined>(value?.field);
  const [sortOrder, setSortOrder] = useState<SortOrder>(value?.order || "asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedField(value?.field);
    if (value?.order) setSortOrder(value.order);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldSelect = (field: T) => {
    setSelectedField(field);
    onSortChange({ field, order: sortOrder });
    setIsOpen(false);
  };

  const toggleSortOrder = () => {
    const newOrder: SortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    if (selectedField) {
      onSortChange({ field: selectedField, order: newOrder });
    }
  };

  const handleClear = () => {
    setSelectedField(undefined);
    setSortOrder("asc");
    onSortChange({ field: "" as T, order: "asc" });
  };

  const getSelectedLabel = () => {
    if (!selectedField) return placeholder;
    const option = options.find((opt) => opt.value === selectedField);
    return option?.label || placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {/* Sort Dropdown Trigger */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="w-full px-4 py-2.5 pl-10 pr-9 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white text-sm text-left focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between shadow-inner cursor-pointer"
          >
            <span className={selectedField ? "text-white font-medium" : "text-slate-400/80"}>
              {getSelectedLabel()}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-purple-400" : ""
              }`}
            />
          </button>
          <ArrowUpDown className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400/80 pointer-events-none" />

          {/* Dropdown Options */}
          {isOpen && !disabled && (
            <div className="absolute left-0 right-0 z-50 mt-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150">
              {options.map((option) => {
                const isSelected = selectedField === option.value;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => handleFieldSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/20 text-purple-300 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Toggle Button */}
        {selectedField && (
          <button
            type="button"
            onClick={toggleSortOrder}
            disabled={disabled}
            className="p-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-purple-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:border-purple-500 transition duration-200 disabled:opacity-50 cursor-pointer"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Clear Button */}
        {selectedField && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="p-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 focus:outline-none transition duration-200 disabled:opacity-50 cursor-pointer"
            title="Clear sort"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;