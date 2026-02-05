export const Modal = ({
  children,
  isOpen,
  onClose,
  signup,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  signup?: boolean;
}) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        onClick={onClose}
        className={`
          absolute inset-0 bg-[#777777CC]/80${signup ? "bg-transparent" : ""}
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      <div
        className={`
          relative z-10 rounded-2xl bg-white p-6 border border-[#CCCCCC]
          transform transition-all duration-300 ease-out
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div className="flex flex-col gap-5">{children}</div>
      </div>
    </div>
  );
};
