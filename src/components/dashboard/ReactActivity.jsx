import { ArrowDownLeft, Bell, ShoppingBasket, Target, UserRound } from "lucide-react";

import Card from "../common/Card";
import { timeAgo } from "../../utils/formatDate";


const ICONS = {
  deposit: ArrowDownLeft,
  produce_sale: ShoppingBasket,
  goal: Target,
  profile: UserRound,
};

/**
 * activity: [{ id, type, message, createdAt }]
 */
export default function RecentActivity({ activity = [], loading = false }) {
  return (
    <Card title="Recent Activity">
      {loading ? (
        <div aria-hidden="true" className="h-40 animate-pulse rounded-lg bg-bg" />
      ) : activity.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No recent activity yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {activity.map((item) => {
            const Icon = ICONS[item.type] ?? Bell;

            return (
              <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                <p className="min-w-0 flex-1 text-sm text-heading">{item.message}</p>

                <time
                  dateTime={item.createdAt}
                  className="shrink-0 text-xs text-muted"
                >
                  {timeAgo(item.createdAt)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}