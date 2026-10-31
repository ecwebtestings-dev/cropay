import { useState } from "react";
import {
  Wallet,
  ArrowDownToLine,
  Sprout,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";

import { formatCurrency } from "../../../utils/formatCurrency";

const SUMMARY_ITEMS = [
  {
    key: "savings",
    label: "Total savings",
    icon: Wallet,
    valueKey: "totalSavings",
  },
  {
    key: "deposits",
    label: "Total deposits",
    icon: ArrowDownToLine,
    valueKey: "totalDeposits",
  },
  {
    key: "sales",
    label: "Produce sales",
    icon: Sprout,
    valueKey: "totalSales",
  },
];

export default function OverviewCards({ summary = {}, onAddMoney }) {
  const [showBalance, setShowBalance] = useState(true);

  const totalSavings = Number(summary.totalSavings) || 0;

  const savingsDisplay = showBalance
    ? formatCurrency(totalSavings)
    : "UGX •••••••";

  return (
    <section>
      {/* MOBILE SAVINGS CARD */}
      <article className="rounded-2xl bg-sidebar p-4 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
  
            <div>
              <p className="text-sm font-medium text-muted">Total Savings</p>
              
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBalance((prev) => !prev)}
            aria-label={showBalance ? "Hide balance" : "Show balance"}
            className="rounded-full p-2 text-muted transition hover:bg-bg hover:text-heading"
          >
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-3xl font-bold tracking-tight text-heading">
            {savingsDisplay}
          </h2>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onAddMoney}
            className="flex w-full items-center justify-self-start gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold text-muted transition hover:opacity-90"
          >
            <Plus size={18} />
            Add Money
          </button>
        </div>
      </article>

      {/* TABLET AND DESKTOP SUMMARY CARDS */}
      <div className="hidden grid-cols-2 gap-4 md:grid xl:grid-cols-3">
        {SUMMARY_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.key}
              className="rounded-md border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted">{item.label}</p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                    {formatCurrency(Number(summary[item.valueKey]) || 0)}
                  </h2>
                </div>

                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
