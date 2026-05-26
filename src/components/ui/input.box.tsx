import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputWithIconProps {
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30 w-full">
      {icon}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-indigo-200 hover:text-indigo-400 focus:outline-none transition-colors duration-200 cursor-pointer shrink-0"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default InputWithIcon;