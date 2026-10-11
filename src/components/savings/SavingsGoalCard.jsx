import { Link } from "react-router-dom";
import { CalendarDays, Pencil, Target, Trash2 } from "lucide-react";
import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getGoalProgress, getGoalStatus } from "../../utils/goalStatus";

const BAR_COLORS = {
  active: "bg-emerald-500",
  completed: "bg-blue-500",
  overdue: "bg-red-500",
};

const iconButton =
  "rounded-lg p-2 text-muted transition-colors hover:bg-bg hover:text-heading " +
  "focus-visible:outline-2 focus-visible:outline-highlight";

/**
 * goal: { id, name, targetAmount, savedAmount, deadline }
 */
export default function SavingsGoalCard({ goal, onEdit, onDelete }) {
  const status = getGoalStatus(goal);
  const percent = getGoalProgress(goal);

  return (
    <article className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-heading sm:text-base">
              {goal.name}
            </h3>
            <p className="truncate text-xs text-muted">
              Target: {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <ProgressBar
        value={percent}
        label={`${goal.name} progress`}
        barClass={BAR_COLORS[status]}
        className="mt-4"
      />

      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
        <span className="truncate">
          {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
        </span>
        <span className="font-semibold text-heading">{percent}%</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2  border-border pt-3">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Due {formatDate(goal.deadline)}</span>
        </p>

        <div className="flex shrink-0 items-center">
          {status !== "completed" && (
            <Link
              to={`/deposits?goal=${goal.id}`}
              className="mr-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-bg"
            >
              Add money
            </Link>
          )}
          <button
            type="button"
            onClick={() => onEdit(goal)}
            aria-label={`Edit ${goal.name}`}
            className={iconButton}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal)}
            aria-label={`Delete ${goal.name}`}
            className={`${iconButton} hover:text-danger`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}