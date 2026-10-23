
import { useCallback, useEffect, useState } from "react";
import {
  Trash2,
  Download,
  ChevronDown,
  Loader2,
} from "lucide-react";

import {
  getLogs,
  deleteAllLogs,
  deleteLog,
} from "../../api/logs";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");


  const extractLogs = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.logs)) return data.logs;

    return [];
  };

  const fetchLogs = useCallback(async () => {
    try {
      setError("");

      const response = await getLogs();
      setLogs(extractLogs(response.data));
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load audit logs."
      );
      throw err;
    }
  }, []);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        await fetchLogs();
      } catch {
        // The error is displayed by the component.
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [fetchLogs]);




  const formatDate = (value) => {
    if (!value) return { date: "—", time: "" };

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return { date: "—", time: "" };
    }

    return {
      date: parsedDate.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: parsedDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };



  // GET THE USERS NAME 
  const getUserName = (log) =>
    log.body?.name ||
    log.user?.name ||
    log.causer?.name ||
    log.name ||
    log.body?.email ||
    log.user?.email ||
    log.causer?.email ||
    log.email ||
    "Unknown user";

      
  const getAction = (log) =>
    log.action || log.event || "Unknown action";

  const getSubject = (log) =>
    log.subject ||
    log.body?.message ||
    log.description ||
    "—";

  const uniqueActions = [
    ...new Set(logs.map(getAction).filter(Boolean)),
  ];

  // COMPARE DATES
  const getLocalDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction =
      actionFilter === "all" ||
      getAction(log) === actionFilter;

    const matchesDate =
      !dateFilter ||
      getLocalDate(log.created_at) === dateFilter;

    return matchesAction && matchesDate;
  });

  const handleDeleteAll = async () => {
    if (logs.length === 0) return;
    try {
      setDeleting(true);
      setError("");

      await deleteAllLogs();

      // Verify the backend's result instead of assuming deletion worked.
      const response = await getLogs();
      const remainingLogs = extractLogs(response.data);

      setLogs(remainingLogs);

      if (remainingLogs.length > 0) {
        setError(
          "The delete request completed, but audit logs are still being returned by the API. Check the Laravel DELETE /logs endpoint."
        );
      } else {
        setActionFilter("all");
        setDateFilter("");
      }
    } catch (err) {
      console.error("Failed to delete audit logs:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete audit logs. Check the API response and try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      setDeletingId(logId);
      setError("");

      await deleteLog(logId);

      const response = await getLogs();
      const remainingLogs = extractLogs(response.data);
      setLogs(remainingLogs);

      if (remainingLogs.some((log) => log.id === logId)) {
        setError(
          "The log is still returned by the API after deletion. Check the Laravel delete endpoint."
        );
      }
    } catch (err) {
      console.error("Failed to delete audit log:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete this audit log."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const headers = [
      "User",
      "Email",
      "Action",
      "Date",
      "Event",
      "IP Address",
      "Status",
    ];

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredLogs.map((log) => [
      getUserName(log),
      getUserEmail(log),
      getAction(log),
      log.created_at || "",
      getSubject(log),
      log.ip_address || "",
      log.status || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "logs.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const selectClass =
    "appearance-none rounded-md border border-border bg-card py-2 pl-3 pr-8 text-xs text-foreground outline-none focus:ring-1 focus:ring-border";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-32 animate-pulse rounded bg-bg" />
        <div className="h-10 animate-pulse rounded-md bg-bg" />

        <div className="overflow-hidden rounded-md border border-border">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 border-b border-border px-4 py-5 last:border-0"
            >
              {Array.from({ length: 6 }).map((__, cell) => (
                <div
                  key={cell}
                  className="h-3 flex-1 animate-pulse rounded bg-bg"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }



  if (error && logs.length === 0) {
    return (
      <div className="py-6">
        <p role="alert" className="text-sm text-foreground">
          {error}
        </p>

        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              await fetchLogs();
            } catch {
              // Keep the displayed error.
            } finally {
              setLoading(false);
            }
          }}
          className="mt-3 rounded-md border border-border px-3 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }



  return (
    <section className="space-y-5 text-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Audit Logs</h2>
          <p className="mt-1 text-sm text-muted">
            Review activity across the system.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={logs.length === 0 || deleting || deletingId !== null}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          {deleting}
        </button>
      </div>

      {/* Date and action filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
            <span className="text-xs text-muted">Date</span>
            <input
              type="date"
              aria-label="Filter logs by date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="min-w-0 bg-transparent text-xs text-foreground outline-none"
            />
          </label>

          <div className="relative">
            <select
              aria-label="Filter logs by action"
              className={selectClass}
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
              size={13}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>

          {(dateFilter || actionFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setDateFilter("");
                setActionFilter("all");
              }}
              className="rounded-md border border-border px-3 py-2 text-xs hover:bg-bg"
            >
              Clear filters
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={filteredLogs.length === 0}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs transition hover:bg-bg disabled:opacity-50"
        >
          <Download size={15} />
          Export
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-foreground">
          {error}
        </p>
      )}

      {/* Logs table */}
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-bg">
            <tr>
              {[
                "Done By",
                "Category",
                "When",
                "Event",
                "IP Address",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-xs font-medium"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const date = formatDate(log.created_at);

              return (
                <tr key={log.id} className="transition hover:bg-bg">
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">
                      {getUserName(log)}
                    </p>
                  
                  </td>

                  <td className="px-4 py-3 text-xs">
                    {getAction(log)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-xs">{date.date}</p>
                    <p className="mt-1 text-xs text-muted">
                      {date.time}
                    </p>
                  </td>

                  <td className="max-w-xs px-4 py-3 text-xs">
                    {getSubject(log)}
                  </td>

                  <td className="px-4 py-3 text-xs">
                    {log.ip_address || "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                     

                      <button
                        type="button"
                        title="Delete log"
                        aria-label={`Delete log ${log.id}`}
                        disabled={deleting || deletingId !== null}
                        onClick={() => handleDeleteLog(log.id)}
                        className="rounded p-1 transition hover:bg-bg disabled:opacity-50"
                      >
                        {deletingId === log.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No logs found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Showing {filteredLogs.length} of {logs.length} logs
      </p>
    </section>
  );
}
