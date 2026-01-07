interface InputWithIconProps{
    icon?: React.ReactNode;
    type?:string;
    placeholder?:string;
    value:string;
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}


const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
      />
    </div>
  );
};


export default InputWithIcon;