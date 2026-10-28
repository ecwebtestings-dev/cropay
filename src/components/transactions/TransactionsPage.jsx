import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  RefreshCw,
  X,
} from "lucide-react";

import { DirectionBadge, StatusBadge,} from "../../components/transactions/Bagdes";
import TransactionDetails from "./TransactionDetails";
import {
  DIRECTION_OPTIONS,
  STATUS_OPTIONS,
  formatAmount,
  formatDateTime,
  normalizeDeposit,

} from "../../components/transactions/helperfunctions";

const PER_PAGE = 25;
const EMPTY_FILTERS = { direction: "all", status: "all", from: "", to: "" };

const fieldClass =
  "w-full rounded-sm border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-sidebar focus:ring-1 focus:ring-sidebar";

export default function TransactionsPage({
  title,
  subtitle,
  loadTransactions,
  showUser = false,
  showGoal = false,
  emptyText = "No transactions yet.",
}) {
  const [deposits, setDeposits] = useState([]); // exactly what the API sent
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ page: 0, lastPage: 0 }); // "page 2 of 5" while loading
  const [refreshKey, setRefreshKey] = useState(0); // changing it loads everything again

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState(null); // transaction shown in the details window

  // ---------- Loading ----------

  useEffect(() => {
    let cancelled = false; // stops the loop if the user leaves the page or presses Refresh

    async function load() {
      try {
        const loaded = await loadTransactions({
          isCancelled: () => cancelled,
          onProgress: (current, lastPage) =>
            !cancelled && setProgress({ page: current, lastPage }),
        });

        if (loaded && !cancelled) setDeposits(loaded);
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.status === 429
            ? "Too many Attempts. Try again after aminute"
            : err.response?.data?.message || "Failed to load transactions.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [loadTransactions, refreshKey]);

  // Runs from a button click, where setting state is fine
  const refresh = () => {
    setLoading(true);
    setError("");
    setProgress({ page: 0, lastPage: 0 });
    setRefreshKey((key) => key + 1);
  };

  // Filtering 
  const transactions = useMemo(
    () =>
      deposits
        .map(normalizeDeposit)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [deposits],
  );

  const filtered = useMemo(() => {
    const from = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
    const to = filters.to ? new Date(`${filters.to}T23:59:59.999`) : null;

    return transactions.filter((t) => {
      if (filters.direction !== "all" && t.direction !== filters.direction)
        return false;
      if (filters.status !== "all" && t.statusKey !== filters.status)
        return false;

      if (from || to) {
        const created = new Date(t.createdAt);
        if (Number.isNaN(created.getTime())) return false;
        if (from && created < from) return false;
        if (to && created > to) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const filtersActive = Object.keys(EMPTY_FILTERS).some(
    (key) => filters[key] !== EMPTY_FILTERS[key],
  );
  const dateRangeInvalid = Boolean(
    filters.from && filters.to && filters.from > filters.to,
  );

  // Changing any filter goes back to page 1
  const changeFilter = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  // ---------- Paging 

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PER_PAGE;
  const pageRows = filtered.slice(pageStart, pageStart + PER_PAGE);



  const columnCount = 6 + (showUser ? 1 : 0) + (showGoal ? 1 : 0);

  return (
    <section className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap- pb-6">
        <div>
          <h1 className="text-xl font-bold text-heading">{title}</h1>
          <p className="mt-1 text-muted">
            {loading && progress.lastPage > 1
              ? `Loading page ${progress.page} of ${progress.lastPage}...`
              : `${filtered.length} ${filtered.length === 1 ? "transaction" : "transactions"}`}
          </p>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-sm bg-card px-4 py-2.5 text-sm font-semibold text-heading hover:bg-bg disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-sm border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="for-direction"
              className="mb-1.5 block text-sm font-medium"
            >
              Direction
            </label>
            <div className="relative">
              <select
                id="for-direction"
                value={filters.direction}
                onChange={(e) => changeFilter("direction", e.target.value)}
                className={`${fieldClass} appearance-none pr-9`}
              >
                {DIRECTION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="f-status"
              className="mb-1.5 block text-sm font-medium"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="f-status"
                value={filters.status}
                onChange={(e) => changeFilter("status", e.target.value)}
                className={`${fieldClass} appearance-none pr-9`}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="f-from"
              className="mb-1.5 block text-sm font-medium"
            >
              From
            </label>
            <input
              id="f-from"
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => changeFilter("from", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="f-to" className="mb-1.5 block text-sm font-medium">
              To
            </label>
            <input
              id="f-to"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => changeFilter("to", e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sidebar hover:underline"
          >
            <X size={14} /> Clear filters
          </button>
        )}
        {dateRangeInvalid && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            The "From" date must be before the "To" date.
          </p>
        )}
      </div>

      {error && (
        <div
          className="flex items-center justify-between p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="rounded-sm text-sidebar px-3 py-1.5 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <div className="overflow-x-auto h-[60vh]">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="border-b border-border bg-bg/10 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-2 py-2 font-semibold">Date</th>
                {showUser && <th className="px-4 py-2 font-semibold">User</th>}
                {showGoal && <th className="px-4 py-2 font-semibold">Goal</th>}
                <th className="px-4 py-2 font-semibold">Direction</th>
                <th className="px-4 py-2 font-semibold">Amount</th>
                <th className="px-4 py-2 font-semibold">Reference</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
             
             
             
              {/* Loading placeholders */}
              {loading &&
                Array.from({ length: 6 }).map((_, row) => (
                  <tr key={row}>
                    {Array.from({ length: columnCount }).map((__, cell) => (
                      <td key={cell} className="px-4 py-2">
                        <div className="h-4 animate-pulse rounded bg-bg" />
                      </td>
                    ))}
                  </tr>
                ))}


              {/* ROWS */}
              {!loading &&
                pageRows.map((row) => (
                  <tr key={`${row.direction}-${row.id}`}>
                    <td className="whitespace-nowrap px-4 py-2 text-sm ">
                      {formatDateTime(row.createdAt)}
                    </td>

                    {showUser && (
                      <td className="px-4 py-2">
                        <p>{row.userName}</p>
                        {row.userDetail && (
                          <p className=" text-muted text-sm">
                            {row.userDetail}
                          </p>
                        )}
                      </td>
                    )}

                    {showGoal && (
                      <td className=" px-4 py-2">
                        <p
                          className="truncate text-sm"
                          title={row.goalName}
                        >
                          {row.goalName || "—"}
                        </p>
                      </td>
                    )}


                    <td className="px-4 py-2">
                      <DirectionBadge direction={row.direction} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-2">
                      <span className="mr-1 text-sm text-muted">UGX</span>
                      <span>
                        {formatAmount(row.amount)}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      {/* gateway ID */}
                      {showUser && (
                        <p
                          className="mt-1 text-sm text-muted"
                          title={row.gatewayRef}
                        >
                          {row.gatewayRef
                            ? `${row.gatewayRef}`
                            : ""}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      <StatusBadge
                        statusKey={row.statusKey}
                        statusText={row.statusText}
                      />
                    </td>

                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setDetails(row)}
                        aria-label="View details"
                        title="View details"
                        className="rounded-lg p-2 text-muted hover:bg-bg hover:text-heading"
                      >
                        <EllipsisVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Nothing to show */}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-4 py-14 text-center text-sm text-muted"
                  >
                    {transactions.length === 0
                      ? emptyText
                      : "No transactions match these filters."}
                    {transactions.length > 0 && filtersActive && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="ml-2 font-medium text-sidebar hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted">
            <span>
              Showing {pageStart + 1}–{pageStart + pageRows.length} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-bg disabled:opacity-40"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 hover:bg-bg disabled:opacity-40"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionDetails
        transaction={details}
        showUser={showUser}
        onClose={() => setDetails(null)}
      />
    </section>
  );
}
