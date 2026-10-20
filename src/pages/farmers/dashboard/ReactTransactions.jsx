import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import StatusBadge from "../../../components/common/StatusBadge";

const TRANSACTION_TYPES = {
  deposit: {
    label: "Deposit",
    icon: ArrowDownToLine,
    color: "bg-emerald-100 text-emerald-700",
  },
  "produce-sale": {
    label: "Produce Sale",
    icon: Sprout,
    color: "bg-orange-100 text-orange-700",
  },
};

export default function RecentTransactions({
  transactions = [],
}) {
  const visibleTransactions = transactions.slice(0, 4);

  return (
    <section className="min-w-0 rounded-md border border-border bg-bg p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-heading">
            Your Recent Transactions
          </h2>
          <p className="mt-1 text-xs text-muted">
            A summary of your latest financial activity.
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {visibleTransactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No transactions yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {visibleTransactions.map((transaction) => {
                const type =
                  TRANSACTION_TYPES[transaction.type] ??
                  TRANSACTION_TYPES.deposit;

                const Icon = type.icon;

                return (
                  <tr key={transaction.id} className="hover:bg-bg/60">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${type.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>

                        <div>
                          <p className="font-medium text-heading">
                            {transaction.description || type.label}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {transaction.reference || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-heading">
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                      {transaction.dateLabel}
                    </td>

                    <td className="px-3 py-3">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}