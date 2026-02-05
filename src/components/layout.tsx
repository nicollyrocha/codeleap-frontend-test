export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex items-start justify-center">
      <div className="w-full md:w-200 pb-6 bg-white rounded-lg shadow-md flex flex-col gap-6 h-full overflow-y-auto">
        <div className="h-20 bg-[#7695EC] text-white flex items-center px-6 font-bold text-[22px] fixed w-full md:w-200 top-0 z-10">
          CodeLeap Network
        </div>
        <div className="mt-20">{children}</div>
      </div>
    </div>
  );
};
