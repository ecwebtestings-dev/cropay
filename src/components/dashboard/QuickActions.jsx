import { Link } from "react-router-dom";
import { ArrowLeftRight, ReceiptText, ShoppingBasket, Target } from "lucide-react";

import Card from "../common/Card";

const ACTIONS = [
  { label: "Make a Deposit", to: "/deposits", Icon: ArrowLeftRight },
  { label: "Set Goal", to: "/savings", Icon: Target },
  { label: "Record Produce Sale", to: "/produce-sales", Icon: ShoppingBasket },
  { label: "View Transactions", to: "/transactions", Icon: ReceiptText },
];

export default function QuickActions() {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        {ACTIONS.map(({ label, to, Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg p-3 text-sm font-medium
              text-heading transition-colors hover:border-primary-500 hover:bg-card
              focus-visible:outline-2 focus-visible:outline-highlight"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">{label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}