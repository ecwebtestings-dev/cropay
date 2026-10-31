import { Plus, CalendarDays, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import GoalProgress from "./GoalProgress";

const getProgress = (goal) => {
  const saved = Number(goal.current_amount ?? goal.currentAmount ?? 0);
  const target = Number(goal.target_amount ?? goal.targetAmount ?? 0);

  if (target <= 0) return 0;

  return Math.min(100, Math.max(0, (saved / target) * 100));
};

export default function SavingsGoalCard({ goal, onDeposit, onView }) {
  const saved = Number(goal.current_amount ?? goal.currentAmount ?? 0);
  const target = Number(goal.target_amount ?? goal.targetAmount ?? 0);
  const progress = getProgress(goal);

  const targetDate = goal.target_date || goal.targetDate;
  const goalName = goal.category?.name || goal.category || "Savings goal";

  return (
    <article className="overflow-hidden rounded-sm border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* GOAL COVER */}
      <div className="relative flex h-32 items-center justify-between overflow-hidden bg-gradient-to-br from-[#143429] to-[#2E7D5B] p-5 text-white">
        <div className="relative z-10">
          <p className="text-xs font-medium text-white/70">SAVINGS GOAL</p>

          <h3 className="mt-2 max-w-[190px] text-lg font-semibold">
            {goalName}
          </h3>

          <p className="mt-1 max-w-[200px] text-xs text-white/75">
            {goal.description || "Building towards your future"}
          </p>
        </div>

        <div className="absolute -right-5 -top-8 h-36 w-36 rounded-full border-[18px] border-white/10" />
        <div className="absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-white/5" />

        <button
          type="button"
          onClick={() => onView?.(goal)}
          aria-label={`View ${goalName}`}
          className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
        >
          <ArrowUpRight size={19} />
        </button>
      </div>

      {/* GOAL DETAILS */}
      <div className="p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted">Amount saved</p>
            <p className="mt-1 text-xl font-bold text-heading">
              {formatCurrency(saved)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted">Target amount</p>
            <p className="mt-1 text-sm font-semibold text-heading">
              {formatCurrency(target)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <GoalProgress progress={progress} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
            <CalendarDays size={14} />

            <span className="truncate">
              {targetDate ? formatDate(targetDate) : "No target date"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onDeposit?.(goal)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={15} />
            Add savings
          </button>
        </div>
      </div>
    </article>
  );
}
