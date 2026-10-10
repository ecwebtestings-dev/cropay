
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "submit",
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`flex h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#151717] text-[15px] font-medium text-white transition hover:bg-[#252727] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d79f3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;