
import {
  Wallet,
  Target,
  ArrowLeftRight,
  ShoppingBasket,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";


const Stats = [
  {
    title: "Total Savings",
    value: "UGX 850,000",
    change: "+12.5%",
    trend: "Up",
    progress: 85,
    icon: Wallet,
    color: "bg-emerald-500",
    bgColor:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    title: "Active Savings Goals",
    value: "3",
    change: "+1",
    trend: "Up",
    progress: 75,
    icon: Target,
    color: "bg-blue-500",
    bgColor:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    title: "Total Deposits",
    value: "UGX 250,000",
    change: "+8.4%",
    trend: "Up",
    progress: 68,
    icon: ArrowLeftRight,
    color: "bg-violet-500",
    bgColor:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    title: "Produce Sales",
    value: "UGX 420,000",
    change: "-2.3%",
    trend: "Down",
    progress: 60,
    icon: ShoppingBasket,
    color: "bg-orange-500",
    bgColor:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  },
];

function StatCard({ stat }) {
  const isUp = stat.trend === "Up";
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const StatIcon = stat.icon;

  return (
    <div
      className="group flex flex-col gap-4 rounded-xl border border-border
        bg-card p-5 transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Statistic title, value, and icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-muted">
            {stat.title}
          </p>

          <p className="truncate text-xl font-semibold text-heading sm:text-2xl">
            {stat.value}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-xl p-3 transition-transform
            duration-200 group-hover:scale-110 ${stat.bgColor}`}
        >
          <StatIcon className="h-6 w-6" />
        </div>
      </div>

      {/* Monthly change */}
      <div className="flex flex-wrap items-center gap-1.5">
        <TrendIcon
          className={`h-4 w-4 ${
            isUp ? "text-emerald-500" : "text-red-500"
          }`}
        />

        <span
          className={`text-sm font-semibold ${
            isUp ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {stat.change}
        </span>

        <span className="text-sm text-muted">
          vs last month
        </span>
      </div>

      {/* Visual indicator */}
      <div
        role="progressbar"
        aria-valuenow={stat.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${stat.title} indicator`}
        className="h-2 overflow-hidden rounded-full bg-bg"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${stat.color}`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>
    </div>
  );
}

export default function StatCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </section>
  );
}

