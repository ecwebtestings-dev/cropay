
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

export default function GoalCard({ goal, onAddMoney }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const completed = goal.status === "completed";

  const barColor =
    completed
      ? "bg-emerald-500"
      : goal.status === "overdue"
        ? "bg-red-400"
        : "bg-sidebar";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleTopUp = () => {
    setMenuOpen(false);
    onAddMoney?.(goal);
  };

  return (
    <article className="flex flex-col rounded-md border border-border bg-card p-5">
      {/* GOAL TITLE AND ACTION MENU */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <h3 className="truncate font-semibold text-heading">
            {goal.category?.name || goal.category || "Savings Goal"}
          </h3>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={`Actions for ${goal.title}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-heading"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-border bg-card p-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleTopUp}
                disabled={completed}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-heading transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={15} />
                Add Savings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, Math.max(0, goal.progress || 0))}
          aria-label={`${goal.title} progress`}
          className="h-2.5 w-full overflow-hidden rounded-full bg-bg"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{
              width: `${Math.min(100, Math.max(0, goal.progress || 0))}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="text-xs text-heading">
            {goal.progress}% of target saved
          </span>
        </div>
      </div>
    </article>
  );
}
