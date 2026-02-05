import { Loader2 } from "lucide-react";

export const Button = ({
  text,
  onClick,
  disabled,
  loading,
  type,
  variant = "primary",
}: {
  text: string | React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "text" | "icon";
  variant?: "primary" | "secondary" | "danger" | "green";
}) => {
  const variantClasses = {
    primary: "bg-[#7695EC] text-white hover:bg-[#7695EC]/70",
    secondary:
      "bg-[#FFFFFF] text-[#333333] hover:bg-[#e0e0e0] border border-[#999999]",
    danger: "bg-[#FF5151] text-white hover:bg-[#FF4444]/70",
    green: "bg-[#47B960] text-white hover:bg-green-600",
  };

  const baseClasses = "rounded-lg font-bold transition-colors";
  const variantClass = variantClasses[variant];
  const sizeClasses =
    type === "icon"
      ? "flex items-center justify-center w-9 h-9 p-0"
      : "px-7 py-1";
  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClass} ${sizeClasses} ${disabledClass}`}
      disabled={disabled}
    >
      {loading ? <Loader2 className="animate-spin" /> : text}
    </button>
  );
};
