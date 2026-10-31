import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Plus, CalendarDays, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../utils/formatDate";



export default function GoalCard({ goal, onAddMoney }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // CHECK WHETHER THE TARGET DATE HAS PASSED.
  const targetDate = goal.targetDate || goal.target_date;

  const datePassed = targetDate
    ? new Date(`${targetDate}T00:00:00`) <
      new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  // CALCULATE PROGRESS WITHOUT RESTRICTING SAVINGS.
  const progress = Math.min(100, Math.max(0, Number(goal.progress) || 0));

  // DETERMINE PROGRESS BAR COLOUR.
  const barColor =
    progress >= 100
      ? "bg-emerald-500"
      : datePassed
        ? "bg-amber-500"
        : "bg-sidebar";



  // CLOSE MENU WHEN CLICKING OUTSIDE.
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



  // OPEN THE DEPOSIT MODAL.
  const handleTopUp = () => { setMenuOpen(false);
    onAddMoney?.(goal);
  };

  const goalName = goal.category?.name || goal.category || "Savings Goal";

  return (
    <article className="flex flex-col rounded-md border border-border bg-card p-5">
      {/* GOAL TITLE AND ACTION MENU */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <h3 className="truncate font-semibold text-heading">{goalName}</h3>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={`Actions for ${goalName}`}
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
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-heading transition hover:bg-bg"
              >
                <Plus size={15} />
                 Save
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
          aria-valuenow={progress}
          aria-label={`${goalName} progress`}
          className="h-2.5 w-full overflow-hidden rounded-full bg-bg"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span className="text-heading">
            {progress.toFixed(1)}% saved
          </span>
        </div>
      </div>

      {/* TARGET DATE OR CONTINUE SAVING MESSAGE */}
      <div className="mt-5 rounded-md bg-bg/70 p-3">
        {datePassed ? (
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold text-heading">
                Your have archived your Goal
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                You can continue saving towards your goal. Keep adding money
                whenever you can and grow your savings beyond your target.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="mt-1 text-sm font-semibold text-heading">
              {targetDate ? formatDate(targetDate) : "Not set"}
            </p>
          </div>
        )}
      </div>

      {/* ADD SAVINGS BUTTON */}
      <button
        type="button"
        onClick={handleTopUp}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-sidebar px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        Save
      </button>
    </article>
  );
}
