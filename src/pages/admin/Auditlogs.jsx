
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Trash2,  Download,
  ChevronDown,
  Loader2,
  RefreshCw,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

import { getLogs, deleteAllLogs } from "../../api/logs";

/* --------------------------------------------------
   CONSTANTS
-------------------------------------------------- */

const TABLE_HEADINGS = [
  "Done By",
  "Category",
  "When",
  "Event",
  "IP Address",
];



const SELECT_CLASS =
  "appearance-none rounded-sm border border-border bg-card py-2 pl-3 pr-8 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";


function extractLogs(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.logs)) return data.logs;
  return [];
}


function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

function formatDate(value) {
  if (!value) return { date: "—", time: "" };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: "—", time: "" };
  }

  return {
    date: date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getLocalDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}



function getUserName(log) {
  return (
    log.body?.name ||
    log.user?.name ||
    log.causer?.name ||
    log.name ||
    log.body?.email ||
    log.user?.email ||
    log.causer?.email ||
    log.email ||
    "Unknown user"
  );
}

function getAction(log) {return log.action || log.event || "Unknown action";}

function getSubject(log) {return (log.subject ||log.body?.message ||log.description ||"—");}

function escapeCsv(value) {return `"${String(value ?? "").replace(/"/g, '""')}"`;}



//SKELETON LOADER
function AuditLogsSkeleton() {
  return (
    <section className="animate-pulse space-y-5">
      
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-6 w-36 rounded-md bg-card" />
          <div className="h-3 w-56 max-w-full rounded bg-card" />
        </div>

        <div className="h-9 w-28 rounded-md bg-card" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="h-9 w-44 rounded-md bg-bg" />
          <div className="h-9 w-32 rounded-md bg-bg" />
        </div>

        <div className="h-9 w-24 rounded-md bg-bg" />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex gap-4 border-b border-border bg-bg px-4 py-4">
          {TABLE_HEADINGS.map((heading) => (
            <div
              key={heading}
              className="h-3 flex-1 rounded bg-border"
            />
          ))}
        </div>

        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-5 last:border-b-0"
          >
            {TABLE_HEADINGS.map((heading, cellIndex) => (
              <div
                key={heading}
                className={`h-3 rounded bg-card ${
                  cellIndex === 0 ? "w-28 flex-none" : "flex-1"
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="h-3 w-32 rounded bg-card" />
    </section>
  );
}




//ERROR STATE
function AuditLogsError({ message, onRetry, retrying }) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          size={19}
          className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
        />

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            Unable to load audit logs
          </h3>

          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {message}
          </p>

          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-200 bg-card px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            {retrying ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}



//MIAN COMPONENT
export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setError("");

    try {
      const response = await getLogs();
      setLogs(extractLogs(response.data));
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(getErrorMessage(err, "Failed to load audit logs."));

      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadLogs() {
      try {
        const response = await getLogs();

        if (!cancelled) {
          setLogs(extractLogs(response.data));
          setError("");
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);

        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load audit logs."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  //FILTERS
  const uniqueActions = useMemo(
    () => [...new Set(logs.map(getAction).filter(Boolean))],
    [logs],
  );

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        const matchesAction =
          actionFilter === "all" || getAction(log) === actionFilter;
        const matchesDate =
          !dateFilter || getLocalDate(log.created_at) === dateFilter;
        return matchesAction && matchesDate;
      }),
    [logs, actionFilter, dateFilter],
  );
  const clearFilters = () => {
    setActionFilter("all");
    setDateFilter("");
  };

  // DELETE ALL LOGS
  const handleDeleteAll = async () => {
    if (logs.length === 0 || deleting) return;
    const confirmed = window.confirm("Are you sure you want to delete all audit logs?",);

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteAllLogs();
      // RETCH
      const response = await getLogs();
      const updatedLogs = extractLogs(response);
      setLogs(updatedLogs);

      // CLEAR FILTERS 
      if (updatedLogs.length === 0) {
        clearFilters();
      }
    } 
    catch (err) {
      console.error("Failed to delete audit logs:", err);
      setError(getErrorMessage(err, "Failed to delete audit logs. Please try again."), );
    } 
    finally {
      setDeleting(false);
    }
  };
  
  
  //EXPORT CSV 
  const handleExport = () => {
    if (filteredLogs.length === 0) return;
    const headers = ["User", "Action", "Date", "Event", "IP Address", "Status"];
    const rows = filteredLogs.map((log) => [
      getUserName(log),
      getAction(log),
      log.created_at || "",
      getSubject(log),
      log.ip_address || "",
      log.status || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {type: "text/csv;charset=utf-8;",});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "logs.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };




// LOADING STATE
  if (loading) {return <AuditLogsSkeleton />;}


// INITIAL ERROR STATE 
  if (error && logs.length === 0) {
    return (
      <AuditLogsError
        message={error}
        retrying={loading}
        onRetry={async () => {
          setLoading(true);

          try {
            await fetchLogs();
          } catch {
            // ERROR
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }



//COMPONENT
  return (
    <section className="space-y-5 text-MUTED">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-heading">
            Audit Logs
          </h2>

          <p className="mt-1 text-sm text-muted">
            Review activity across the system.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={logs.length === 0 || deleting}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}

          {deleting ? "Deleting" : "Delete all"}
        </button>
      </div>

      {/* FILTERS AND EXPORT */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
            <span className="text-sm font-medium text-heading">Date</span>

            <input
              type="date"
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-heading outline-none"
            />
          </label>

          <div className="relative min-w-32">
            <select
              aria-label="Filter by action"
              className={SELECT_CLASS}
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
            >
              <option value="all">All actions</option>

              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>

          {(dateFilter || actionFilter !== "all") && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-muted transition hover:bg-bg hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={filteredLogs.length === 0}
          className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} />
          Export
        </button>
      </div>

      {/*  ERROR */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/*  LOGS TABLE */}
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-bg">
            <tr>
              {TABLE_HEADINGS.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="text-xs px-3 py-2 font-semibold uppercase tracking-wide text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40">
            {/*FILTERED LOGS TABEL */}
            {filteredLogs.map((log, index) => {
              const date = formatDate(log.created_at);
              return (
                <tr
                  key={log.id ?? `${log.created_at}-${index}`}
                  className="transition-colors hover:bg-bg/70"
                >
                  <td className="px-4 py-2">
                    <p className="max-w-44 truncate text-sm font-medium text-foreground">
                      {getUserName(log)}
                    </p>
                  </td>

                  <td className="px-4 py-2 text-sm ">{getAction(log)}</td>

                  <td className="whitespace-nowrap flex justify-center gap-1 items-center px-4 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {date.date}
                    </p>

                    <p>{date.time || "—"}</p>
                  </td>

                  <td className="max-w-xs px-4 py-2 text-sm">
                    <p className="line-clamp-2" title={getSubject(log)}>
                      {getSubject(log)}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                    {log.ip_address || "—"}
                  </td>
                </tr>
              );
            })}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={TABLE_HEADINGS.length} className="px-4 py-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-bg p-3">
                      <ClipboardList size={22} className="text-muted" />
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {logs.length === 0
                        ? "No audit logs yet"
                        : "No matching logs"}
                    </p>

                    <p className="mt-1 max-w-sm text-xs text-muted">
                      {logs.length === 0
                        ? "System activity will appear here when audit events are recorded."
                        : "Try changing your date or action filters."}
                    </p>

                    {logs.length > 0 &&
                      (dateFilter || actionFilter !== "all") && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-3 text-xs font-medium text-primary hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p>
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredLogs.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{logs.length}</span>{" "}
          logs
        </p>

        {(dateFilter || actionFilter !== "all") && <p>Filters are active</p>}
      </div>
    </section>
  );
}
