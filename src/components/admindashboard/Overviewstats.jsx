import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Wallet,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

import { formatNumber } from "../../utils/formatCurrency";

// REUSABLE STATISTIC CARD
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  to,
  pathDescription,
}) {
  const cardClasses =
    "block rounded-md border border-border bg-card p-3 transition hover:border-accent/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight";

  const cardContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-tight text-muted">
          {title}
        </p>

        {Icon && (
          <div className="flex shrink-0 items-center justify-center rounded-xs bg-accent/10 p-1.5 text-accent">
            <Icon size={20} />
          </div>
        )}
      </div>

      <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-heading">
        {value ?? 0}
      </h2>

      <div className="mt-2 flex items-center justify-between gap-3 border-t border-border pt-2">
        {subtitle && (
          <p className="min-w-0 text-sm tracking-tighter text-muted">
            {subtitle}
          </p>
        )}

        {pathDescription && (
          <p className="shrink-0 text-sm font-semibold text-accent">
            {pathDescription}{" "}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </p>
        )}
      </div>
    </div>
  );

  if (!to) {
    return <div className={cardClasses}>{cardContent}</div>;
  }

  return (
    <Link
      to={to}
      className={`group ${cardClasses}`}
      aria-label={`${title}: ${value ?? 0}. View details`}
    >
      {cardContent}
    </Link>
  );
}

// REUSABLE SECTION HEADING
export function SectionHeading({ title, subtitle }) {
  return (
    <div>
      <h2 className="font-semibold text-heading">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

// ADMIN OVERVIEW STATISTICS
export default function OverviewStats({
  users = {},
  deposits = {},
  savingGoals = {},
  productSales = {},
}) {
  // CALCULATE ACTIVE USER STATISTICS.
  const totalUsers = Number(users.total || 0);
  const activeUsers = Number(users.active || 0);

  return (
    <div className="space-y-6">
      {/* PLATFORM OVERVIEW */}
      <section>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Users"
            value={formatNumber(totalUsers)}
            subtitle="Registered platform farmers"
            icon={Users}
            to="/admin/users"
            pathDescription="View users"
          />

          <StatCard
            title="Active Accounts"
            value={formatNumber(activeUsers)}
            icon={UserCheck}
            to="/admin/users"
            pathDescription="Manage accounts"
          />

          <StatCard
            title="Total Transactions"
            value={formatNumber(Number(deposits.total_records || 0))}
            subtitle="Recorded Transactions"
            icon={Wallet}
            to="/admin/transactions"
            pathDescription="View transactions"
          />

          <StatCard
            title="Total Goal Accounts"
            value={formatNumber(Number(savingGoals.total || 0))}
            icon={TrendingUp}
            to="/admin/savings-goals"
            pathDescription="View Accounts"
          />

          <StatCard
            title="Produce Sale Requests"
            value={formatNumber(Number(productSales.total_sales_placed || 0))}
            icon={ShoppingCart}
            to="/admin/producesales"
            pathDescription="View product sales"
          />
        </div>
      </section>
    </div>
  );
}
