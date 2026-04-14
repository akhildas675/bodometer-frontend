type RadioProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};
 
export const Radio = ({ label, active, onClick }: RadioProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group"
    >
      {/* Circle */}
      <div
        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${active ? "border-purple-500" : "border-white/30 group-hover:border-white/60"}`}
      >
        {active && <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />}
      </div>
 
      {/* Label */}
      <span className={`text-sm transition-colors ${active ? "text-white font-medium" : "text-white/70 group-hover:text-white/90"}`}>
        {label}
      </span>
    </div>
  );
};
 