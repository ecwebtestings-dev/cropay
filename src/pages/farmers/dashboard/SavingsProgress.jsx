import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import ProgressBar from "../../../components/common/ProgressBar";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getGoalProgress } from "../../../utils/goalStatus";

export default function SavingsProgress({ goals = [] }) {
  const visibleGoals = goals.slice(0, 3);

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-heading">
            Savings Progress
          </h2>
          <p className="mt-1 text-xs text-muted">
            Track your savings goals.
          </p>
        </div>

        <Link
          to="/savings"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {visibleGoals.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Target className="h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-medium text-heading">
            No savings goals yet
          </p>
          <p className="mt-1 text-xs text-muted">
            Create a goal to start tracking your progress.
          </p>
          <Link
            to="/savings"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Create a goal
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {visibleGoals.map((goal) => {
            const percent = getGoalProgress(goal);

            return (
              <div key={goal.id} className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">
                      {goal.name}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Target: {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-heading">
                    {percent}%
                  </span>
                </div>

                <ProgressBar
                  value={percent}
                  label={`${goal.name} progress`}
                  barClass="bg-emerald-600"
                  className="mt-3"
                />

                <div className="mt-2 flex flex-wrap justify-between gap-1 text-xs text-muted">
                  <span>{formatCurrency(goal.savedAmount)} saved</span>
                  <span>
                    {formatCurrency(
                      Math.max(
                        0,
                        Number(goal.targetAmount) -
                          Number(goal.savedAmount)
                      )
                    )}{" "}
                    remaining
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}