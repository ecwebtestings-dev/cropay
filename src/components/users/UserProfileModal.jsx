
import { useEffect, useState } from "react";
import {Mail,Phone,ShieldCheck,} from "lucide-react";

import Modal from "../../components/common/Modal";


const ROLE_LABELS = {
  farmer: "Farmer",
  admin: "Admin",
  super_admin: "Super Admin",
};

const isSuspended = (user) => {
  if (user?.is_active !== undefined && user?.is_active !== null) {
    return (
      user.is_active === false ||
      user.is_active === 0 ||
      String(user.is_active).toLowerCase() === "false"
    );
  }

  return ["suspended", "suspended_account"].includes(
    String(user?.status ?? "").toLowerCase()
  );
};



function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-muted">
        {label}
      </span>

      <span className="flex min-w-0 items-center gap-2 break-all text-right text-sm font-medium text-heading">
  
        {children}
      </span>
    </div>
  );
}

export default function UserProfileModal({
  user,
  onClose,
  onToggleStatus,
  onChangeRole,
  currentUserRole = "admin",
  currentUserId,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [user]);

  if (!user) return null;

  const suspended = isSuspended(user);

  const isSelf =
    currentUserId != null &&
    String(user.id) === String(currentUserId);

  const targetIsSuperAdmin = user.role === "super_admin";

  const canManageTarget =
    !isSelf &&
    (!targetIsSuperAdmin || currentUserRole === "super_admin");

  const canChangeRole =
    canManageTarget &&
    ["farmer", "admin"].includes(user.role);

  const phone =
    user.profile?.phone ??
    user.phone ??
    user.phone_number ??
    "";

  const emailVerified =
    user.email_verified === true ||
    Boolean(user.email_verified_at);

  const displayName =
    user.name || user.username || "Unnamed user";

  async function runAction(action, fallbackMessage) {
    setLoading(true);
    setError("");

    try {
      await action();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          fallbackMessage
      );
    } finally {
      setLoading(false);
    }
  }

  function handleToggleStatus() {
    const nextStatus = suspended ? "active" : "suspended";

    runAction(() => onToggleStatus(user.id, nextStatus),
      "Unable to change account status."
    );
  }

  function handleChangeRole() {
    const nextRole =
      user.role === "farmer" ? "admin" : "farmer";

    runAction(
      () => onChangeRole(user.id, nextRole),
      "Unable to change user role."
    );
  }



  return (
    <Modal
      open
      onClose={loading ? () => {} : onClose}
      size="max-w-xl"
    >
      <div className="space-y-3 text-heading">
        
        <div className="flex items-center justify-center">
            <h2 className="text-md font-bold text-heading">
              {displayName}
            </h2>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="flex items-center justify-center">
          <section className="w-full rounded-md p-3 sm:p-4">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
              Contact & Account
            </h3>

            <InfoRow label="Phone" icon={Phone}>
              {phone || "—"}
            </InfoRow>

            <InfoRow label="Email" icon={Mail}>
              <span className="break-all">
                {user.email || "—"}
              </span>

              {emailVerified && (
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-emerald-600"
                  title="Email verified"
                />
              )}
            </InfoRow>

            <InfoRow label="Role">
              <span className="font-semibold text-sidebar">
                {ROLE_LABELS[user.role] || user.role || "Unknown"}
              </span>
            </InfoRow>

            <InfoRow label="Account Status">
              <span
                className={
                  suspended
                    ? "font-semibold text-red-600"
                    : "font-semibold text-emerald-700"
                }
              >
                {suspended ? "Suspended" : "Active"}
              </span>
            </InfoRow>
          </section>
        </div>

        {/* ADMINISTRATIVE ACTIONS */}
        <section className="rounded-md border border-border p-4 sm:p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
            Administrative Actions
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={!canManageTarget || loading}
              className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                suspended
                  ? "text-sidebar hover:bg-bg"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              {loading
                ? "Processing..."
                : suspended
                  ? "Activate Account"
                  : "Suspend Account"}
            </button>

            {canChangeRole && (
              <button
                type="button"
                onClick={handleChangeRole}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium text-heading transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {user.role === "farmer"
                  ? "Make Admin"
                  : "Remove Admin"}
              </button>
            )}
          </div>

          {isSelf && (
            <p className="mt-3 text-xs text-muted">
              You cannot suspend or change the role of your own account.
            </p>
          )}

          {!isSelf &&
            targetIsSuperAdmin &&
            currentUserRole !== "super_admin" && (
              <p className="mt-3 text-xs text-muted">
                Only a Super Admin can manage this account.
              </p>
            )}
        </section>
      </div>
    </Modal>
  );
}
