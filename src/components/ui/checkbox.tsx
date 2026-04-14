
type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: () => void;
};
 
export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-3 cursor-pointer group"
    >
      {/* Box */}
      <div
        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
          ${checked
            ? "border-purple-500 bg-purple-500"
            : "border-white/30 bg-transparent group-hover:border-white/60"
          }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
 
      {/* Label */}
      <span
        className={`text-sm capitalize transition-colors ${
          checked ? "text-white font-medium" : "text-white/70 group-hover:text-white/90"
        }`}
      >
        {label}
      </span>
    </div>
  );
};