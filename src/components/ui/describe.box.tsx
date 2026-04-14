type DescribeBoxProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const DescribeBox = ({ value, onChange }: DescribeBoxProps) => {
  return (
    <input
      type="text"
      placeholder="Describe..."
      value={value}
      onChange={onChange}
      className="bg-[#2a2f7a] px-4 py-2 rounded-md text-sm text-white mt-2 w-60 outline-none"
    />
  );
};