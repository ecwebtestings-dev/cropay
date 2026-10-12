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
  const ID = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const DescribedBy = error ? `${ID}-error` : undefined;

  return (
    
    <div className={`relative pb-4 ${className}`}>
      {/* LABEL */}
      <label
        htmlFor={ID}
        className="mb-0.5 block text-sm font-medium text-muted"
      >
        {label}
      </label>

      {/* INPUT FIELD */}
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
        )}

        <input
          id={ID}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={DescribedBy}
          className={`h-12 w-full rounded-md border bg-white/95 text-sm text-heading
            transition-colors
            placeholder:text-sm placeholder:text-muted/70
            focus:border-sidebar focus:outline-none focus:ring-2 focus:ring-white
            ${Icon ? "pl-10" : "pl-3"}
            ${isPassword ? "pr-10" : "pr-3"}
            ${error ? "border-muted" : "border-border"}`}
          {...inputProps}
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:text-heading"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* INPUT FIELD ERROR*/}
      {error && (
        <p
          id={`${ID}-error`}
          role="alert"
          className="absolute bottom-0 left-0 text-xs leading-4 text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}