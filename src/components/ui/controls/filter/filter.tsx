
interface FilterOption {
  label: string;
  value: unknown;
}

interface FilterSelectProps {
  label?: string;
  value: unknown;
  options: FilterOption[];
  onChange: (value: unknown) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = '',
  showLabel = true,
}: FilterSelectProps) => {
  const handleChange = (val: string) => {
    if (val === '') {
      onChange(undefined);
    } else if (val === 'true') {
      onChange(true);
    } else if (val === 'false') {
      onChange(false);
    } else {
      onChange(val);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && label && (
        <label className="text-sm text-gray-400 font-medium">
          {label}
        </label>
      )}
      <select
        value={value === undefined ? '' : String(value)}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={label || 'Filter'}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;