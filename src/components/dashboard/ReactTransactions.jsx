import { Link } from "react-router-dom";

import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const TYPE_LABELS = {
  deposit: "Deposit",
  produce_sale: "Produce Sale",
  withdrawal: "Withdrawal",
};

/**
 * transactions: [{ id, type, amount, createdAt, status }]
 */
export default function RecentTransactions({ transactions = [], loading = false }) {
  return (
    <Card
      title="Recent Transactions"
      action={
        <Link to="/transactions" className="text-sm font-medium text-accent hover:underline">
          View all
        </Link>
      }
    >
      {loading ? (
        <div aria-hidden="true" className="h-40 animate-pulse rounded-lg bg-bg" />
      ) : transactions.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No transactions yet.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="py-2 pr-3 font-medium">Type</th>
                <th scope="col" className="py-2 pr-3 font-medium">Amount</th>
                <th scope="col" className="hidden py-2 pr-3 font-medium sm:table-cell">Date</th>
                <th scope="col" className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => {
                const isOutgoing = transaction.type === "withdrawal";

                return (
                  <tr key={transaction.id}>
                    <td className="py-3 pr-3 text-heading">
                      {TYPE_LABELS[transaction.type] ?? transaction.type}
                    </td>
                    <td
                      className={`whitespace-nowrap py-3 pr-3 font-medium ${
                        isOutgoing ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isOutgoing ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="hidden whitespace-nowrap py-3 pr-3 text-muted sm:table-cell">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}