import { ArrowDownLeft, ArrowUpRight, ReceiptText } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

// NORMALIZE TRANSACTION TYPE
const getTransactionType = (transaction) =>
  String(
    transaction.type ||
      transaction.transaction_type ||
      transaction.category ||
      "Transaction",
  ).toLowerCase();

// NORMALIZE TRANSACTION STATUS
const getStatus = (transaction) =>String(transaction.status || "Pending").toLowerCase();



export default function ReactTransactions({
  transactions = [],
  loading = false,
  onViewAll,
}) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <section className="bg-card border border-border rounded-md overflow-hidden">
     
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-heading">
            Recent Transactions
          </h2>
          <p className="text-sm text-muted mt-1">
            Your latest account activity
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-heading hover:underline"
          >
            View all
          </button>
        )}
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="p-8 text-center text-sm text-muted">
          Loading transactions...
        </div>
      ) 
      : recentTransactions.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-12 px-5">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center mb-3">
            <ReceiptText size={22} className="text-muted" />
          </div>

          <h3 className="font-semibold text-heading">No transactions yet</h3>

          <p className="text-sm text-muted mt-1 text-center">
            Your deposits and other account activities will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-card text-xs uppercase text-muted">
                <tr>
                  <th className="px-5 py-4 font-semibold">Transaction</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {recentTransactions.map((transaction, index) => {
                  const type = getTransactionType(transaction);
                  const isDeposit =
                    type.includes("deposit") || type.includes("saving");

                  const status = getStatus(transaction);

                  return (
                    <tr
                      key={transaction.id || transaction.reference || index}
                      className="hover:bg-[#F8FAF8] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isDeposit
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft size={19} />
                            ) : (
                              <ArrowUpRight size={19} />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-sm text-[#143429] capitalize">
                              {transaction.description ||
                                transaction.type ||
                                transaction.transaction_type ||
                                "Transaction"}
                            </p>

                            <p className="text-xs text-[#6B7C73] mt-1">
                              {transaction.reference || "Account activity"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#6B7C73]">
                        {formatDate(
                          transaction.created_at ||
                            transaction.transaction_date ||
                            transaction.date,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#143429]">
                        {formatCurrency(
                          transaction.amount || transaction.total_amount,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            status === "completed" || status === "successful"
                              ? "bg-green-50 text-green-700"
                              : status === "failed"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE TRANSACTION CARDS */}
          <div className="md:hidden divide-y divide-[#DDE3DE]">
            {recentTransactions.map((transaction, index) => {
              const type = getTransactionType(transaction);
              const isDeposit =
                type.includes("deposit") || type.includes("saving");

              const status = getStatus(transaction);

              return (
                <div
                  key={transaction.id || transaction.reference || index}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                        isDeposit
                          ? "bg-green-50 text-green-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {isDeposit ? (
                        <ArrowDownLeft size={19} />
                      ) : (
                        <ArrowUpRight size={19} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#143429] truncate">
                        {transaction.description ||
                          transaction.type ||
                          transaction.transaction_type ||
                          "Transaction"}
                      </p>

                      <p className="text-xs text-[#6B7C73] mt-1">
                        {formatDate(
                          transaction.created_at ||
                            transaction.transaction_date ||
                            transaction.date,
                        )}
                      </p>

                      <span
                        className={`inline-block mt-1 text-xs capitalize ${
                          status === "completed" || status === "successful"
                            ? "text-green-700"
                            : status === "failed"
                              ? "text-red-700"
                              : "text-yellow-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#143429] whitespace-nowrap">
                    {formatCurrency(
                      transaction.amount || transaction.total_amount,
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
