export const Input = ({
  type,
  placeholder,
  value,
  onChange,
  label,
  defaultValue,
}: {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  defaultValue?: string;
}) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-[16px]">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="placeholder-[#CCCCCC] placeholder:text-[14px] w-full border border-[#777777] bg-white p-3 py-1 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-[#7695EC] rounded-lg"
      />
    </div>
  );
};
