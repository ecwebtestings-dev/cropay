import { useId } from "react";
import { Check } from "lucide-react";

const Checkbox = ({ label, className = "", ...props }) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={`group flex cursor-pointer select-none items-center gap-2 text-sm text-[#151717] ${className}`}
    >
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer h-full w-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-[#ecedec] bg-white transition checked:border-[#151717] checked:bg-[#151717] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d79f3] focus-visible:ring-offset-2"
          {...props}
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden="true"
        />
      </span>
      {label}
    </label>
  );
};

export default Checkbox;