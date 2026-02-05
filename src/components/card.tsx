export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:w-188 bg-white rounded-2xl p-6 border border-[#999999]">
      {children}
    </div>
  );
};
