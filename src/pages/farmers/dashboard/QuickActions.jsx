import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ReceiptText,
  ShoppingBasket,
  Target,
} from "lucide-react";

import Card from "../../../components/common/Card";

const ACTIONS = [
  {
    label: "Make a Deposit",
    description: "Add money to your savings",
    to: "/deposits",
    Icon: ArrowLeftRight,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Set Goal",
    description: "Plan your next target",
    to: "/savings",
    Icon: Target,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Record Produce Sale",
    description: "Track your farm earnings",
    to: "/produce-sales",
    Icon: ShoppingBasket,
    color: "bg-orange-100 text-orange-700",
  },
  {
    label: "View Transactions",
    description: "Review your transactions",
    to: "/transactions",
    Icon: ReceiptText,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function QuickActions() {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {ACTIONS.map(({ label, description, to, Icon, color }) => (
          <Link
            key={label}
            to={to}
            className="group flex min-w-0 items-center gap-3 rounded-lg
              border border-border bg-bg p-3 text-sm text-heading
              transition-all duration-200
              hover:border-primary-500 hover:bg-card hover:shadow-sm
              focus-visible:outline-2 focus-visible:outline-highlight"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg ${color}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-semibold">
                {label}
              </span>

              <span className="mt-1 block text-xs text-muted">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}