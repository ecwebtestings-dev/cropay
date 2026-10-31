import { ArrowRight } from "lucide-react";
import SavingsGoalCard from "../savingsAccount/SavingsGoalCard";
import EmptySavingsState from "../dashboard/EmptyState";

export default function SavingsOverview({
  goals = [],
  onCreateGoal,
  onDeposit,
  onViewGoal,
  onViewAll,
}) {
  return (
    <section className="rounded-sm border border-border bg-card p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-heading">Savings accounts</h2>
          <p className="mt-1 text-sm text-muted">Track your savings goals.</p>
        </div>

        {goals.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight size={16} />
          </button>
        )}
      </div>

      {goals.length === 0 ? (
        <EmptySavingsState onCreateGoal={onCreateGoal} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {goals.slice(0, 3).map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onDeposit={onDeposit}
              onView={onViewGoal}
            />
          ))}
        </div>
      )}
    </section>
  );
}
