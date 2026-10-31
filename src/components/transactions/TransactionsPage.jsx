import { useEffect, useMemo, useState } from "react";
import { ChevronDown, EllipsisVertical, RefreshCw, X } from "lucide-react";

import {
  DirectionBadge,
  StatusBadge,
} from "../../components/transactions/Bagdes";

import TransactionDetails from "./Details";

import {
  DIRECTION_OPTIONS,
  STATUS_OPTIONS,
  formatAmount,
  formatDateTime,
  normalizeDeposit,
} from "../../components/transactions/helperfunctions";

const PER_PAGE = 25;

const EMPTY_FILTERS = {
  direction: "all",
  status: "all",
  from: "",
  to: "",
};

// SHARED STYLES FOR FILTER INPUTS.
const fieldClass =
  "w-full rounded-sm border border-border bg-card px-3 py-2 text-sm text-body outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

// SHARED STYLES FOR SECONDARY BUTTONS.
const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50";

export default function TransactionsPage({
  title = "Transactions",
  subtitle,
  loadTransactions,
  showUser = false,
  showGoal = false,
  emptyText = "No transactions yet.",
}) {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [progress, setProgress] = useState({
    page: 0,
    lastPage: 0,
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState(null);

  // CHECK WHETHER THE SELECTED DATE RANGE IS VALID.
  const dateRangeInvalid = Boolean(
    filters.from && filters.to && filters.from > filters.to,
  );

  // LOAD TRANSACTIONS.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      setProgress({
        page: 0,
        lastPage: 0,
      });

      try {
        const loaded = await loadTransactions({
          isCancelled: () => cancelled,

          onProgress: (current, lastPage) => {
            if (!cancelled) {
              setProgress({
                page: current,
                lastPage,
              });
            }
          },
        });

        if (!cancelled) {
          if (!Array.isArray(loaded)) {
            throw new Error("Invalid transactions response.");
          }

          setDeposits(loaded);
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load transactions. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [loadTransactions, refreshKey]);

  // REFRESH TRANSACTIONS.
  const refresh = () => {
    setError("");
    setProgress({
      page: 0,
      lastPage: 0,
    });

    setRefreshKey((previous) => previous + 1);
  };

  // NORMALIZE AND SORT TRANSACTIONS.
  const transactions = useMemo(() => {
    return deposits.map(normalizeDeposit).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return (
        (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA)
      );
    });
  }, [deposits]);

  // FILTER TRANSACTIONS.
  const filtered = useMemo(() => {
    if (dateRangeInvalid) return [];

    const from = filters.from ? new Date(`${filters.from}T00:00:00`) : null;

    const to = filters.to ? new Date(`${filters.to}T23:59:59.999`) : null;

    return transactions.filter((transaction) => {
      // FILTER BY DIRECTION.
      if (
        filters.direction !== "all" &&
        transaction.direction !== filters.direction
      ) {
        return false;
      }

      // FILTER BY STATUS.
      if (
        filters.status !== "all" &&
        transaction.statusKey !== filters.status
      ) {
        return false;
      }

      // FILTER BY DATE RANGE.
      if (from || to) {
        const createdAt = new Date(transaction.createdAt);

        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }

        if (from && createdAt < from) {
          return false;
        }

        if (to && createdAt > to) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters, dateRangeInvalid]);

  // CHECK WHETHER ANY FILTER IS ACTIVE.
  const filtersActive = Object.keys(EMPTY_FILTERS).some(
    (key) => filters[key] !== EMPTY_FILTERS[key],
  );

  // UPDATE FILTER VALUES.
  const changeFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPage(1);
  };

  // CLEAR ALL FILTERS.
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  // PAGINATION.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PER_PAGE;

  const pageRows = filtered.slice(pageStart, pageStart + PER_PAGE);

  // ACCOUNT FOR OPTIONAL USER AND GOAL COLUMNS.
  const columnCount = 7 + Number(showUser) + Number(showGoal);

  return (
    <section className="space-y-5 text-body">
      {/* PAGE HEADER */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-7 text-heading">
            {title}
          </h1>

          <p className="mt-1 text-sm font-medium text-muted">
            {loading && progress.lastPage > 1
              ? `Loading page ${progress.page} of ${progress.lastPage}...`
              : `${filtered.length} ${
                  filtered.length === 1 ? "transaction" : "transactions"
                }`}
          </p>

          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-muted">{subtitle}</p>
          )}
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className={secondaryButtonClass}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {/* FILTERS */}
      <section className="rounded-sm border border-border bg-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-heading">
            Filter transactions
          </h2>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* DIRECTION FILTER */}
          <div>
            <label
              htmlFor="transaction-direction"
              className="mb-1.5 block text-sm font-semibold text-heading"
            >
              Direction
            </label>

            <div className="relative">
              <select
                id="transaction-direction"
                value={filters.direction}
                onChange={(event) =>
                  changeFilter("direction", event.target.value)
                }
                className={`${fieldClass} appearance-none pr-9`}
              >
                {DIRECTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          {/* STATUS FILTER */}
          <div>
            <label
              htmlFor="transaction-status"
              className="mb-1.5 block text-sm font-semibold text-heading"
            >
              Status
            </label>

            <div className="relative">
              <select
                id="transaction-status"
                value={filters.status}
                onChange={(event) => changeFilter("status", event.target.value)}
                className={`${fieldClass} appearance-none pr-9`}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          {/* START DATE FILTER */}
          <div>
            <label
              htmlFor="transaction-from"
              className="mb-1.5 block text-sm font-semibold text-heading"
            >
              From date
            </label>

            <input
              id="transaction-from"
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(event) => changeFilter("from", event.target.value)}
              className={fieldClass}
            />
          </div>

          {/* END DATE FILTER */}
          <div>
            <label
              htmlFor="transaction-to"
              className="mb-1.5 block text-sm font-semibold text-heading"
            >
              To date
            </label>

            <input
              id="transaction-to"
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(event) => changeFilter("to", event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        {dateRangeInvalid && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            The start date must be before or equal to the end date.
          </p>
        )}
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-card p-3">
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="text-sm font-semibold text-accent hover:underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {/* TRANSACTIONS TABLE */}
      <section className="overflow-hidden rounded-sm border border-border bg-card">
        <div className="h-[60vh] overflow-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            {/* TABLE HEADER */}
            <thead className="sticky top-0 z-10 border-b border-border bg-bg">
              <tr className="text-sm font-semibold uppercase tracking-wide text-muted">
                <th scope="col" className="whitespace-nowrap px-4 py-3">
                  Date
                </th>

                {showUser && (
                  <th scope="col" className="px-4 py-3">
                    User
                  </th>
                )}

                {showGoal && (
                  <th scope="col" className="px-4 py-3">
                    Goal
                  </th>
                )}

                <th scope="col" className="px-4 py-3">
                  Direction
                </th>

                <th scope="col" className="whitespace-nowrap px-4 py-3">
                  Amount
                </th>

                <th scope="col" className="whitespace-nowrap px-4 py-3">
                  Phone number
                </th>

                <th scope="col" className="px-4 py-3">
                  Reference
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>

                <th scope="col" className="px-4 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50">
              {/* LOADING PLACEHOLDERS */}
              {loading &&
                Array.from({ length: 6 }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: columnCount }).map(
                      (__, cellIndex) => (
                        <td
                          key={`skeleton-${rowIndex}-${cellIndex}`}
                          className="px-4 py-2"
                        >
                          <div className="h-4 animate-pulse rounded-sm bg-bg" />
                        </td>
                      ),
                    )}
                  </tr>
                ))}

              {/* TRANSACTION ROWS */}
              {!loading &&
                !error &&
                pageRows.map((row, index) => (
                  <tr
                    key={row.id || `${row.direction}-${pageStart + index}`}
                    className="transition-colors hover:bg-bg/50"
                  >
                    {/* DATE */}
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-heading">
                      {formatDateTime(row.createdAt)}
                    </td>

                    {/* USER */}
                    {showUser && (
                      <td className="max-w-[200px] px-4 py-2">
                        <p
                          className="truncate text-sm text-heading"
                          title={row.userName || ""}
                        >
                          {row.userName || "—"}
                        </p>
                      </td>
                    )}

                    {/* SAVINGS GOAL */}
                    {showGoal && (
                      <td className="max-w-[180px] px-4 py-2">
                        <p
                          className="truncate text-sm text-heading"
                          title={row.goalName || ""}
                        >
                          {row.goalName || "—"}
                        </p>
                      </td>
                    )}

                    {/* TRANSACTION DIRECTION */}
                    <td className="px-4 py-2">
                      <DirectionBadge direction={row.direction} />
                    </td>

                    {/* TRANSACTION AMOUNT */}
                    <td className="whitespace-nowrap px-4 py-2">
                      <span className="mr-1 text-sm font-medium text-heading">
                        UGX
                      </span>

                      <span className="text-sm font-semibold tabular-nums text-heading">
                        {formatAmount(row.amount)}
                      </span>
                    </td>

                    {/* PHONE NUMBER USED FOR THIS TRANSACTION */}
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-body">
                      {row.depositorPhone || "Not provided"}
                    </td>

                    {/* CROPPAY TRANSACTION REFERENCE */}
                    <td className="max-w-[190px] px-4 py-2">
                      <p
                        className="truncate text-sm text-muted"
                        title={row.reference || ""}
                      >
                        {row.reference || "—"}
                      </p>
                    </td>

                    {/* TRANSACTION STATUS */}
                    <td className="px-4 py-2">
                      <StatusBadge
                        statusKey={row.statusKey}
                        statusText={row.statusText}
                      />
                    </td>

                    {/* ROW ACTIONS */}
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => setDetails(row)}
                        aria-label={`View transaction ${
                          row.reference || row.id
                        }`}
                        title="View transaction details"
                        className="inline-flex items-center justify-center rounded-sm p-2 text-muted transition-colors hover:bg-bg hover:text-heading"
                      >
                        <EllipsisVertical size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

              {/* EMPTY STATE */}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={columnCount} className="px-4 py-12 text-center">
                    <p className="text-sm font-medium text-heading">
                      {dateRangeInvalid
                        ? "Please select a valid date range."
                        : transactions.length === 0
                          ? emptyText
                          : "No transactions match these filters."}
                    </p>

                    {transactions.length > 0 && filtersActive && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-2 text-sm font-medium text-accent hover:underline"
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

        {/* PAGINATION */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-heading">
                {pageStart + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-heading">
                {Math.min(pageStart + PER_PAGE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-heading">
                {filtered.length}
              </span>{" "}
              transactions
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
                className={secondaryButtonClass}
              >
                Previous
              </button>

              <span className="whitespace-nowrap text-sm font-medium text-heading">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={currentPage === totalPages}
                className={secondaryButtonClass}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* TRANSACTION DETAILS MODAL */}
      <TransactionDetails
        transaction={details}
        showUser={showUser}
        onClose={() => setDetails(null)}
      />
    </section>
  );
}
