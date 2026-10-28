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
          className="rounded-md border border-border bg-card p-4 transition hover:border-slate-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted">
                {label}
              </p>

              <p className="mt-2 text-2xl font-bold text-heading">{value}</p>
            </div>

            <Icon size={20} className="text-muted" />
          </div>

          <p className="mt-3 text-sm text-muted">{description}</p>
        </div>
      ))}
    </div>
  );
}
