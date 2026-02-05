export const TextArea = ({
  placeholder,
  value,
  onChange,
  label,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
}) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-2 text-[16px]">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="placeholder-[#CCCCCC] placeholder:text-[14px] w-full h-18.5 border border-[#777777] bg-white p-3 py-1 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-[#7695EC] rounded-lg"
      />
    </div>
  );
};
