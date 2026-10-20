import {
  Wallet,
  ArrowDownToLine,
  Sprout,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

const STAT_CONFIG = [
  {
    key: "totalSavings",
    label: "Total Savings",
    icon: Wallet,
    color: "bg-emerald-100 text-emerald-700",
    currency: true,
  },
  {
    key: "totalDeposits",
    label: "Total Deposits",
    icon: ArrowDownToLine,
    color: "bg-blue-100 text-blue-700",
    currency: true,
  },
  {
    key: "totalSales",
    label: "Produce Sales",
    icon: Sprout,
    color: "bg-orange-100 text-orange-700",
    currency: true,
  },
  {
    key: "totalTransactions",
    label: "Total Transactions",
    icon: ArrowLeftRight,
    color: "bg-purple-100 text-purple-700",
    currency: false,
  },
];

export default function StatCards({ stats = {} }) {
  return (
    <section
      aria-label="Account summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {STAT_CONFIG.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key] ?? 0;

        return (
          <article
            key={item.key}
            className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted">
                  {item.label}
                </p>

                <p className="mt-2 break-words text-xl font-bold text-heading sm:text-2xl">
                  {item.currency
                    ? formatCurrency(value)
                    : Number(value).toLocaleString()}
                </p>
              </div>

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            {stats.changes?.[item.key] != null && (
              <p className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {stats.changes[item.key]}
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}