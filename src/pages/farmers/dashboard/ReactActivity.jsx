import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  Sprout,
  Target,
  UserRound,
  Bell,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

const ACTIVITY_ICONS = {
  deposit: {
    icon: ArrowDownToLine,
    color: "bg-emerald-100 text-emerald-700",
  },
  sale: {
    icon: Sprout,
    color: "bg-green-100 text-green-700",
  },
  goal: {
    icon: Target,
    color: "bg-blue-100 text-blue-700",
  },
  profile: {
    icon: UserRound,
    color: "bg-purple-100 text-purple-700",
  },
  notification: {
    icon: Bell,
    color: "bg-orange-100 text-orange-700",
  },
};

export default function RecentActivity({ activities = [] }) {
  const visibleActivities = activities.slice(0, 4);

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-heading">
          Recent Activity
        </h2>

        <Link
          to="/notifications"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {visibleActivities.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No recent activity to display.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {visibleActivities.map((activity) => {
            const config =
              ACTIVITY_ICONS[activity.type] ??
              ACTIVITY_ICONS.notification;

            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex min-w-0 items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.color}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-heading">
                    {activity.title}
                  </p>

                  {activity.description && (
                    <p className="mt-1 break-words text-xs text-muted">
                      {activity.description}
                    </p>
                  )}

                  {activity.amount != null && (
                    <p className="mt-1 text-xs font-semibold text-heading">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-muted">
                    {activity.timeLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}