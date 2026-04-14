type SkillProps = {
  label: string;
  checked?: boolean;
  onClick?: () => void;
};

export const Skill = ({ label, checked, onClick }: SkillProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-3 rounded-full flex items-center justify-between transition-all ${
        checked
          ? "bg-purple-600 text-white"
          : "bg-purple-900/30 text-white border border-purple-700/50"
      } hover:bg-purple-600 hover:scale-105`}
    >
      <span className="text-sm font-medium">{label}</span>

      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          checked ? "border-white bg-white" : "border-white"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </button>
  );
};