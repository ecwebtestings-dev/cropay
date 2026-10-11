import {
  Wallet,
  ArrowLeftRight,
  ShoppingBasket,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { formatCurrency } from "../../utils/formatCurrency";
import ProgressBar from "../common/ProgressBar";

// How each stat from the API is shown. The keys match `stats` in the dashboard data.
const CARDS = [
  {
    key: "totalSavings",
    title: "Total Savings",
    Icon: Wallet,
    format: formatCurrency,
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    barClass: "bg-emerald-500",
  },
  {
    key: "totalDeposits",
    title: "Total Deposits",
    Icon: ArrowLeftRight,
    format: formatCurrency,
    iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    barClass: "bg-violet-500",
  },
  {
    key: "produceSales",
    title: "Produce Sales",
    Icon: ShoppingBasket,
    format: formatCurrency,
    iconClass: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    barClass: "bg-orange-500",
  },
  {
    key: "totalTransactions",
    title: "Total Transactions",
    Icon: Receipt,
    format: (value) => String(value ?? 0),
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    barClass: "bg-blue-500",
  },
];

function StatCard({ title, Icon, value, change, progress, iconClass, barClass }) {
  const hasChange = typeof change === "number";
  const isUp = !hasChange || change >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-muted">{title}</p>
          <p className="truncate text-xl font-semibold text-heading sm:text-2xl">{value}</p>
        </div>

        <div
          className={`shrink-0 rounded-xl p-3 transition-transform duration-200 group-hover:scale-110 ${iconClass}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      {hasChange && (
        <div className="flex flex-wrap items-center gap-1.5">
          <TrendIcon
            className={`h-4 w-4 ${isUp ? "text-emerald-500" : "text-red-500"}`}
            aria-hidden="true"
          />
          <span className={`text-sm font-semibold ${isUp ? "text-emerald-500" : "text-red-500"}`}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-sm text-muted">vs last month</span>
        </div>
      )}

      {typeof progress === "number" && (
        <ProgressBar value={progress} label={`${title} indicator`} barClass={barClass} />
      )}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[148px] animate-pulse rounded-xl border border-border bg-card"
    />
  );
}


export default function StatCards({ stats, loading = false }) {
  return (
    <section
      aria-label="Account summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {CARDS.map((card) => {
        if (loading || !stats?.[card.key]) {
          return <StatCardSkeleton key={card.key} />;
        }

        const stat = stats[card.key];

        return (
          <StatCard
            key={card.key}
            title={card.title}
            Icon={card.Icon}
            iconClass={card.iconClass}
            barClass={card.barClass}
            value={card.format(stat.value)}
            change={stat.change}
            progress={stat.progress}
          />
        );
      })}
    </section>
  );
}