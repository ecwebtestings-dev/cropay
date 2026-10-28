import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export default function InputField({
  label,
  Icon,
  error,
  type = "text",
  className = "",
  ...inputProps
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const errorId = `${id}`;

  return (
    <div className={`relative pb-1 ${className}`}>
      <label htmlFor={id}className="mb-2 block text-sm font-medium text-carbon-black-800">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-dusty-olive-600"
          />
        )}

        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-13 w-full rounded-xl border
            text-[15px] text-carbon-black-900
            transition-colors placeholder:text-dusty-olive-500
            focus:border-black-forest-600 focus:outline-none
            focus:ring-2 focus:ring-black-forest-600/15
            disabled:cursor-not-allowed disabled:opacity-60
            ${Icon ? "pl-12" : "pl-4"}
            ${isPassword ? "pr-12" : "pr-4"}
            ${error ? "border-red-500" : "border-dusty-olive-200"}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5
              text-dusty-olive-600 transition hover:text-carbon-black-800
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-black-forest-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId}
          className="absolute bottom-2 left-3 text-xs leading-4 text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
