import {
  Wallet,
  ArrowDownToLine,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

const STAT_CONFIG = [
  {
    key: "totalSavings",
    label: "Total Savings",
    icon: Wallet,
    currency: true,
  },
  {
    key: "totalDeposits",
    label: "Total Deposits",
    icon: ArrowDownToLine,
    currency: true,
  },
  {
    key: "totalSales",
    label: "Produce Sales",
    icon: Sprout,
    currency: true,
  },
  
];

export default function StatCards({ stats = {} }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {STAT_CONFIG.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key] ?? 0;

        return (
          <article key={item.key}
            className="min-w-0 min-h-[150px] rounded-md border border-border  bg-bg p-5  transition-shadow hover:border-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase text-muted">
                  {item.label}
                </p>

                <p className="mt-2 break-words text-md font-bold text-heading sm:text-2xl">
                  {item.currency ? formatCurrency(value): Number(value).toLocaleString()}
                </p>
              </div>

              <span className={`flex h-10 w-10 shrink-0 items-center bg-[#dfebe4] justify-center rounded-xl }`}
>
                <Icon className="h-5 w-5"  />
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