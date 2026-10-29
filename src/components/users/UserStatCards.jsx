import { User2, UserCheck, UserX, ShieldCheck } from "lucide-react";

export default function UserStatCards({ stats }) {
  const cards = [
    {
      label: "Total Users",
      value: stats.total_users,
      description: "All registered accounts",
      Icon: User2,
    },
    {
      label: "Active Users",
      value: stats.active_users,
      description: "All active accounts",
      Icon: UserCheck,
    },
    {
      label: "Suspended Users",
      value: stats.suspended_users,
      description: "All suspended accounts",
      Icon: UserX,
    },
    {
      label: "Admin Users",
      value: stats.admin_users,
      description: "All administrator accounts",
      Icon: ShieldCheck,
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, description, Icon }) => (
        <div
          key={label}
          className="rounded-sm border border-border bg-card p-4 transition-colors hover:border-accent"
        >
          {/* CARD HEADING AND STATISTIC */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-heading">
                {label}
              </p>

              <p className="mt-2 text-2xl font-semibold leading-8 tabular-nums text-heading">
                {value.toLocaleString()}
              </p>
            </div>

            {/* KEEP ICON COLORS CONSISTENT */}
            <Icon
              size={20}
              strokeWidth={1.8}
              className="shrink-0 text-muted"
              aria-hidden="true"
            />
          </div>

          {/* CARD DESCRIPTION */}
          <div className="mt-3 border-t border-border pt-2">
            <p className="text-sm leading-5 text-muted">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
