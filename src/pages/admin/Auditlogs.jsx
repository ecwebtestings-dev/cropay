
import { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Download,
  ChevronDown,
  Loader2,
} from "lucide-react";

import {
  getLogs,
  deleteAllLogs,
} from "../../api/logs";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [browserFilter, setBrowserFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setError("");

        const response = await getLogs();
        const data = response.data;

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.logs)
                ? data.logs
                : [];

        setLogs(records);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load audit logs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (date) => {
    if (!date) return { date: "—", time: "" };

    const parsedDate = new Date(date);

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

  const getUserName = (log) =>
    log.user?.name ||
    log.user_name ||
    log.causer?.name ||
    log.email ||
    "Unknown user";

  const getUserEmail = (log) =>
    log.user?.email ||
    log.user_email ||
    log.causer?.email ||
    "";

  const getAction = (log) =>
    log.action || log.event || "Unknown action";

  const getSubject = (log) =>
    log.subject ||
    log.body?.message ||
    log.description ||
    "—";

  const getBrowser = (log) => {
    const agent =
      log.user_agent ||
      log.userAgent ||
      log.browser ||
      "";

    if (/edg/i.test(agent)) return "Edge";
    if (/opr|opera/i.test(agent)) return "Opera";
    if (/chrome/i.test(agent)) return "Chrome";
    if (/firefox/i.test(agent)) return "Firefox";
    if (/safari/i.test(agent) && !/chrome/i.test(agent)) {
      return "Safari";
    }

    return agent || "—";
  };

  const uniqueValues = (values) =>
    [...new Set(values.filter(Boolean))];

  const users = uniqueValues(logs.map(getUserName));
  const actions = uniqueValues(logs.map(getAction));
  const browsers = uniqueValues(logs.map(getBrowser));

  const filteredLogs = logs.filter((log) => {
    return (
      (userFilter === "all" || getUserName(log) === userFilter) &&
      (actionFilter === "all" || getAction(log) === actionFilter) &&
      (browserFilter === "all" || getBrowser(log) === browserFilter)
    );
  });

  const handleDeleteAll = async () => {
    if (!logs.length) return;

    const confirmed = window.confirm(
      `Delete all ${logs.length} audit logs? This action may be irreversible.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteAllLogs();
      setLogs([]);
    } catch (err) {
      console.error("Failed to delete audit logs:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete audit logs."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const headers = [
      "User",
      "Email",
      "Action",
      "Date",
      "Subject",
      "Browser",
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
      getBrowser(log),
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
    link.download = "audit-logs.csv";
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
          onClick={() => window.location.reload()}
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
          <h2 className="text-xl font-semibold">Audit logs</h2>
          <p className="mt-1 text-sm text-muted">
            Review activity across the system.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={logs.length === 0 || deleting}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          {deleting ? "Deleting..." : "Delete logs"}
        </button>
      </div>

      {/* Filters and export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "User",
              value: userFilter,
              setter: setUserFilter,
              options: users,
            },
            {
              label: "Action",
              value: actionFilter,
              setter: setActionFilter,
              options: actions,
            },
            {
              label: "Browser",
              value: browserFilter,
              setter: setBrowserFilter,
              options: browsers,
            },
          ].map((filter) => (
            <div key={filter.label} className="relative">
              <select
                aria-label={`Filter by ${filter.label}`}
                className={selectClass}
                value={filter.value}
                onChange={(event) =>
                  filter.setter(event.target.value)
                }
              >
                <option value="all">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={filteredLogs.length === 0}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs transition hover:bg-bg disabled:opacity-50"
        >
          <Download size={15} />
          Export logs
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-foreground">
          {error}
        </p>
      )}

      {/* Logs table */}
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-b border-border bg-bg">
            <tr>
              {[
                "User",
                "Action",
                "Date & Time",
                "Subject",
                "Browser",
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
                    <p className="mt-1 text-xs text-muted">
                      {getUserEmail(log) || log.ip_address || "—"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs">
                      {getAction(log)}
                    </span>
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
                    {getBrowser(log)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        title="View log details"
                        aria-label={`View log ${log.id}`}
                        onClick={() => {
                          window.alert(
                            [
                              `User: ${getUserName(log)}`,
                              `Action: ${getAction(log)}`,
                              `Subject: ${getSubject(log)}`,
                              `IP address: ${log.ip_address || "—"}`,
                              `Status: ${log.status || "—"}`,
                              `Date: ${log.created_at || "—"}`,
                            ].join("\n")
                          );
                        }}
                        className="rounded p-1 transition hover:bg-bg"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="Delete log"
                        aria-label={`Delete log ${log.id}`}
                        onClick={() => {
                          window.alert(
                            "Connect your deleteLog endpoint to enable single-log deletion."
                          );
                        }}
                        className="rounded p-1 transition hover:bg-bg"
                      >
                        <Trash2 size={15} />
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
                  No audit logs found.
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
