import { Link } from "react-router-dom";
import { Target } from "lucide-react";

import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { getGoalProgress, getGoalStatus } from "../../utils/goalStatus";

/**
 * goals: [{ id, name, targetAmount, savedAmount, status }]
 */
export default function SavingsProgress({ goals = [], loading = false }) {
  return (
    <Card
      title="Savings Progress"
      action={
        <Link to="/savings" className="text-sm font-medium text-accent hover:underline">
          View all
        </Link>
      }
    >
      {loading ? (
        <div aria-hidden="true" className="h-32 animate-pulse rounded-lg bg-bg" />
      ) : goals.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          No active savings goals. Create one to get started.
        </p>
      ) : (
        <ul className="space-y-5">
          {goals.map((goal) => {
            const percent = getGoalProgress(goal);

            return (
              <li key={goal.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Target className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-heading">{goal.name}</p>
                      <p className="truncate text-xs text-muted">
                        Target: {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={getGoalStatus(goal)} />
                </div>

                <ProgressBar
                  value={percent}
                  label={`${goal.name} progress`}
                  className="mt-3"
                />

                <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
                  <span>
                    {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                  <span className="font-semibold text-heading">{percent}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}