import { useState } from "react";
import { MoreVertical, Eye, EyeOff, Plus } from "lucide-react";

import { formatCurrency } from "../../../utils/formatCurrency";
import GoalProgress from "./GoalProgress";

const getProgress = (goal) => {
  const saved = Number(goal.current_amount ?? goal.currentAmount ?? 0);
  const target = Number(goal.target_amount ?? goal.targetAmount ?? 0);

  if (target <= 0) return 0;

  return Math.min(100, Math.max(0, (saved / target) * 100));
};

export default function SavingsGoalCard({ goal, user, onDeposit }) {
  const [showBalance, setShowBalance] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const saved = Number(goal.current_amount ?? goal.currentAmount ?? 0);

  const progress = getProgress(goal);

  const fullName = user?.name?.trim() || "Farmer";
  const goalName = goal.category?.name || goal.category || "Savings goal";

  const handleDeposit = () => {
    setMenuOpen(false);
    onDeposit?.(goal);
  };

  return (
    <article className="relative overflow-hidden rounded-md border border-border bg-card transition hover:cursor-pointer">
      {/* CARD HEADER */}
      <div className="relative overflow-hidden bg-sidebar px-5 py-5 text-white">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/70">{fullName}</p>

            <h3 className="mt-2 truncate text-lg font-semibold">{goalName}</h3>
          </div>

          {/* ELLIPSIS MENU */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-expanded={menuOpen}
              className="grid h-5 w-5 place-items-center text-white"
            >
              <MoreVertical size={21} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-50 w-48 overflow-hidden rounded-sm border border-border bg-card py-1"
              >
                {/* SHOW / HIDE BALANCE */}
                <button
                  type="button"
                  onClick={() => {
                    setShowBalance((previous) => !previous);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-heading"
                >
                  {showBalance ? (
                    <EyeOff size={16} className="text-heading" />
                  ) : (
                    <Eye size={16} className="text-heading" />
                  )}

                  {showBalance ? "Hide balance" : "Show balance"}
                </button>

                {/* ADD SAVINGS */}
                <button
                  type="button"
                  onClick={handleDeposit}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left bg-sidebar text-sm font-medium text-heading"
                >
                  <Plus size={17} />
                  Transact
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SAVINGS BALANCE */}
      <div className="p-5">
        <div className="mt-2 min-h-9">
          {showBalance ? (
            <p className="text-xl font-bold tracking-tight text-heading">
              {formatCurrency(saved)}
            </p>
          ) : (
            <p className="text-2xl font-bold tracking-widest text-heading">
              
            </p>
          )}
        </div>

        {/* SAVINGS PROGRESS */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-heading">
              {Math.round(progress)}% of target saved
            </p>
          </div>

          <GoalProgress progress={progress} />
        </div>
      </div>
    </article>
  );
}
