import React from "react";

interface PrimaryButtonProps {
  text: string;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  size?: "sm" | "md" | "lg";  
}

const sizeClasses = {
  sm: "py-2 text-xs",      
  md: "py-3 text-sm",        
  lg: "py-4 text-base",      
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  loading = false,
  type = "button",
  onClick,
  size = "md",        
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        w-full mt-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7]
        font-semibold text-white shadow-lg shadow-purple-900/50
        hover:scale-[1.02] transition-transform
        ${sizeClasses[size]}     // 👈 DYNAMIC SIZE HERE
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Please wait..." : text}
    </button>
  );
};

export default PrimaryButton;
