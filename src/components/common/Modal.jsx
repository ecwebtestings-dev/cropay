import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = "max-w-md",
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // This effect depends on "open" only, so it runs once when the window opens and once when it closes.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Focus the window once, when it opens, unless a field inside already took focus (autoFocus).
    if (!panelRef.current?.contains(document.activeElement)) {
      panelRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.(); // give focus back to the button that opened the window
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <div onClick={onClose} className="absolute inset-0 bg-sidebar/60" />

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
          <h2 id={titleId} className="text-lg font-semibold text-heading">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
