import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children, size = "max-w-md" }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-sidebar/60"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[90dvh] w-full ${size} overflow-y-auto rounded-t-2xl bg-card p-5
          shadow-xl focus:outline-none sm:rounded-2xl sm:p-6`}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-md font-semibold text-heading">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}