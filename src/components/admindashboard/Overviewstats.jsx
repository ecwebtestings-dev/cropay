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
  iconClass = "text-muted bg-slate-100",
}) {
  
    const cardClasses =
      "block rounded-md border border-slate-200 bg-card p-3 transition hover:border-sidebar/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

    const cardContent = (
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold uppercase tracking-tight text-muted">
            {title}
          </p>

          {Icon && (
            <div
              className={`flex shrink-0 items-center justify-center rounded-xs p-1.5 text-slate-500 ${iconClass}`}
            >
              <Icon size={20} />
            </div>
          )}
        </div>

        <h2 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </h2>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
          {subtitle && (
            <p className="min-w-0 text-sm text-muted tracking-tighter">
              {subtitle}
            </p>
          )}

          {pathDescription && (
            <p className="shrink-0 text-sm font-semibold text-muted">
              {pathDescription} <span>→</span>
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
      className={cardClasses}
      aria-label={`${title}: ${value}. View details`}
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
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
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
  // CALCULATE ACTIVE USER PERCENTAGE
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
            subtitle=""
            icon={UserCheck}
            to="/admin/users"
            pathDescription="Manage accounts"
          />

          <StatCard
            title="Total Transactions"
            value={formatNumber(deposits.total_records)}
            subtitle="Recorded Transactions"
            icon={Wallet}
            to="/admin/transactions"
            pathDescription="View transactions"
          />

          <StatCard
            title="Total Goal Accounts"
            value={formatNumber(savingGoals.total)}
            subtitle=""
            icon={TrendingUp}
            to="/admin/savings-goals"
            pathDescription="View Accounts"
          />

          <StatCard
            title="Produce Sale Requests"
            value={formatNumber(productSales.total_sales_placed)}
            subtitle=""
            icon={ShoppingCart}
            to="/admin/producesales"
            pathDescription="View product sales"
          />
        </div>
      </section>
    </div>
  );
}
