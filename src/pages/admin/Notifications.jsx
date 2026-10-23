import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  X,
  Sprout,
  Check,
  CheckCheck,
  RefreshCw,
  Inbox,
  Loader2,
} from "lucide-react";

import {
  getNotifications,
  markNotificationsAsRead,
} from "../../api/notifications";

function getTitle(notification) {
  const type = notification.type || "";

  if (type.toLowerCase().includes("savinggoal")) {
    return "New Saving Goal";
  }

  return "New Notification";
}

function formatTime(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function getResponseData(response) {
  const body = response?.data;

  if (Array.isArray(body?.notifications)) return body;
  if (Array.isArray(body?.data?.notifications)) return body.data;

  return { unread_count: 0, notifications: [] };
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const panelRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNotifications();
      const result = getResponseData(response);

      setNotifications(result.notifications);

      setUnreadCount(
        result.unread_count ??
          result.notifications.filter((item) => !item.read_at).length,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);




  const handleMarkAsRead = async (notification) => {
    if (notification.read_at || busyId) return;

    setBusyId(notification.id);
    setError("");

    try {
      // MATCH THIS PAYLOAD TO YOUR LARAVEL CONTROLLER
      await markNotificationsAsRead({
        notification_ids: [notification.id],
      });

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to mark notification as read.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((item) => !item.read_at);

    if (!unread.length || busyId) return;

    setBusyId("all");
    setError("");

    try {
     
      await markNotificationsAsRead({
        notification_ids: unread.map((item) => item.id),
      });

      const readAt = new Date().toISOString();

      setNotifications((current) =>
        current.map((item) =>
          item.read_at ? item : { ...item, read_at: readAt },
        ),
      );

      setUnreadCount(0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to mark notifications as read.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* HEADER BELL BUTTON */}
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);

          if (nextOpen) loadNotifications();
        }}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg hover:cursor-pointer text-foreground bg-card"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* NOTIFICATION POPOVER */}
      {open && (
        <div className="absolute right-0 top-full z-[100] mt-2 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xl">
          {/* PANEL HEADER */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-heading">
                Notifications
              </h2>
              <p className="mt-0.5 text-xs text-muted">{unreadCount} unread</p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={busyId !== null}
                  title="Mark all as read"
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary hover:bg-bg disabled:opacity-50"
                >
                  <CheckCheck size={15} />
                  All read
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted">
              <RefreshCw size={16} className="animate-spin" />
              Refreshing
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="px-4 py-3 text-xs text-red-500">
              {error}
              <button
                type="button"
                onClick={loadNotifications}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && notifications.length === 0 && !error && (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Inbox size={25} className="text-muted" />
              <p className="text-sm font-medium text-heading">
                No notifications yet
              </p>
              <p className="text-xs text-muted">
                New activity will appear here.
              </p>
            </div>
          )}

          {/* NOTIFICATION LIST */}
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.map((notification) => {
              const unread = !notification.read_at;

              return (
                <div
                  key={notification.id}
                  className={`border-b border-border px-4 py-3 last:border-b-0 ${
                    unread ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        unread
                          ? "bg-primary/10 text-primary"
                          : "bg-bg text-muted"
                      }`}
                    >
                      <Sprout size={12} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-heading">
                          {getTitle(notification)}
                        </h3>

                        {unread && (
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                            title="Unread"
                          />
                        )}
                      </div>

                      <p className="mt-1 break-words text-sm leading-5 text-foreground">
                        {notification.data?.message ||
                          "You have a new notification."}
                      </p>

                      <p className="mt-1.5 text-xs text-muted">
                        {formatTime(notification.created_at)}
                      </p>

                      {unread && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification)}
                          disabled={busyId !== null}
                          className="mt-2 inline-flex items-center gap-1 rounded-md py-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                        >
                          <Check size={14} />
                          {busyId === notification.id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Mark as read"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
