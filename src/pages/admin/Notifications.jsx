import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  X,
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

import formatTime from "../../utils/formatTime";

function getTitle(notification) {
  const type = notification.type || "";

  return type.toLowerCase().includes("savinggoal")
    ? "New Saving Goal"
    : "New Notification";
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

    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleMarkAsRead = async (notification) => {
    if (notification.read_at || busyId !== null) return;

    setBusyId(notification.id);
    setError("");

    try {
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

    if (!unread.length || busyId !== null) return;

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
      {/* NOTIFICATION BUTTON */}
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);

          if (nextOpen) loadNotifications();
        }}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-foreground transition hover:bg-bg"
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
        <div
          className="
            fixed left-1/2 top-16 z-[100]
            w-[calc(100vw-24px)] max-w-[380px]
            -translate-x-1/2
            overflow-hidden rounded-xl border border-border
            bg-card text-foreground shadow-xl
            sm:absolute sm:left-auto sm:right-0 sm:top-full
            sm:mt-2 sm:w-[380px] sm:translate-x-0
          "
        >
          {/* PANEL HEADER */}
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
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
                  className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary transition hover:bg-bg disabled:opacity-50"
                >
                  <CheckCheck size={15} />
                  <span>All read</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-bg hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted">
              <RefreshCw size={16} className="animate-spin" />
              Loading notifications...
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
          <div className="max-h-[min(420px,calc(100dvh-120px))] overflow-y-auto">
            {notifications.map((notification) => {
              const unread = !notification.read_at;

              return (
                <div
                  key={notification.id}
                  className={`border-b border-border px-4 py-3 last:border-b-0 ${
                    unread ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-heading">
                        {getTitle(notification)}
                      </h3>

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
                          className="mt-2 inline-flex items-center gap-1 rounded-md py-1 text-xs font-semibold text-primary transition hover:underline disabled:opacity-50"
                        >
                          {busyId === notification.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          Mark as read
                        </button>
                      )}
                    </div>

                    {unread && (
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                        title="Unread"
                      />
                    )}
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
