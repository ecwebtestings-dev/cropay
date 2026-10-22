import { useEffect, useState } from "react";
import {Mail, Phone, CalendarDays, Clock, Pencil, UserCheck, UserX, Shield, Save, AlertCircle, ShieldCheck,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import InputField from "../../components/common/InputFields";
import { formatDate } from "../../utils/formatDate";
import { validateName, validateEmail, ValidatePhone } from "../../validators/index";

const ROLE_LABELS = { farmer: "Farmer", admin: "Admin", super_admin: "Super Admin" };

const buttonClass =
  "flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-heading disabled:opacity-50";

// Works whether the API sends { status } or { is_active }.
const isSuspended = (u) =>
  u?.status != null
    ? ["suspended", "suspended_account"].includes(String(u.status).toLowerCase())
    : u?.is_active === false || u?.is_active === 0 || String(u?.is_active).toLowerCase() === "false";

const initialForm = (u) => ({
  name: u.name || "",
  username: u.username || "",
  email: u.email || "",
  phone: u.phone || u.phone_number || "",
});

// One list drives the form inputs, validation and the payload.
// Username and phone only appear if the user object actually has them.
const fieldsFor = (u) =>
  [
    { name: "name", label: "Full name", validate: validateName },
    { name: "username", label: "Username", validate: (v) => (v.trim() ? "" : "Username required"), show: "username" in u },
    { name: "email", label: "Email", type: "email", validate: validateEmail },
    { name: "phone", label: "Phone", type: "tel", validate: (v) => (v.trim() ? ValidatePhone(v) : ""), show: "phone" in u || "phone_number" in u },
  ].filter((f) => f.show ?? true);

const InfoRow = ({ icon: Icon, children, className = "text-heading" }) => (
  <p className={`flex items-center gap-3 text-sm ${className}`}>
    <Icon size={17} />
    {children}
  </p>
);

export default function UserProfileModal({
  user, onClose, onSave, onToggleStatus, onChangeRole,
  currentUserRole = "admin", currentUserId,
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm(initialForm(user));
    setEditing(false);
    setErrors({});
    setError("");
    setConfirmation(null);
  }, [user]);

  if (!user) return null;

  const suspended = isSuspended(user);
  const isSelf = user.id === currentUserId;
  const targetIsSuperAdmin = user.role === "super_admin";
  const canManageTarget = !isSelf && (!targetIsSuperAdmin || currentUserRole === "super_admin");
  const canChangeRole = canManageTarget && ["farmer", "admin"].includes(user.role);
  const fields = fieldsFor(user);

  // Shared loading / error handling for every API call in this modal.
  const run = async (fn, fallbackMessage, onDone) => {
    setLoading(true);
    setError("");
    try {
      await fn();
      onDone?.();
    } catch (err) {
      setError(err?.response?.data?.message || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    const found = Object.fromEntries(
      fields.map((f) => [f.name, f.validate(form[f.name] ?? "")]).filter(([, msg]) => msg)
    );
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload = Object.fromEntries(fields.map((f) => [f.name, form[f.name].trim()]));
    run(() => onSave(user.id, payload), "Unable to update user.", () => setEditing(false));
  };

  const handleConfirm = () =>
    run(
      () =>
        confirmation.type === "status"
          ? onToggleStatus(user.id, confirmation.value)
          : onChangeRole(user.id, confirmation.value),
      "The action failed.",
      () => setConfirmation(null)
    );

  const ask = (action) => {
    setError("");
    setConfirmation(action);
  };

  const statusLabel = suspended ? "Reactivate Account" : "Suspend Account";
  const roleLabel = user.role === "farmer" ? "Promote to Admin" : "Demote to Farmer";

  const actions = [
    { key: "edit", Icon: Pencil, label: "Edit Details", disabled: editing, onClick: () => { setErrors({}); setError(""); setEditing(true); } },
    { key: "status", Icon: suspended ? UserCheck : UserX, label: statusLabel, disabled: !canManageTarget,
      onClick: () => ask({ type: "status", value: suspended ? "active" : "suspended", label: statusLabel }) },
    canChangeRole && { key: "role", Icon: Shield, label: roleLabel,
      onClick: () => ask({ type: "role", value: user.role === "farmer" ? "admin" : "farmer", label: roleLabel }) },
  ].filter(Boolean);

  const emailVerified = user.email_verified === true || Boolean(user.email_verified_at);

  return (
    <Modal open title="User Profile" onClose={loading ? () => {} : onClose} size="max-w-2xl">
      <div className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-heading">{user.name || user.username || "Unnamed user"}</h3>
          {user.username && <p className="text-sm text-muted">@{user.username}</p>}

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 ${suspended ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              {suspended ? "Suspended" : "Active"}
            </span>
            <span className="rounded-full bg-bg px-3 py-1 text-muted">
              {ROLE_LABELS[user.role] || user.role || "Unknown"}
            </span>
          </div>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={17} /> {error}
          </p>
        )}

        {/* Details */}
        <section>
          <h4 className="mb-3 font-semibold text-heading">Contact & Account</h4>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-2">
              {fields.map((f) => (
                <InputField
                  key={f.name}
                  label={f.label}
                  name={f.name}
                  type={f.type}
                  value={form[f.name] ?? ""}
                  onChange={handleInputChange}
                  error={errors[f.name]}
                  disabled={loading}
                />
              ))}
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-sidebar px-4 py-2 text-white disabled:opacity-50">
                  <Save size={16} /> Save
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => { setEditing(false); setErrors({}); setError(""); setForm(initialForm(user)); }}
                  className="rounded-md border border-border px-4 py-2 text-heading"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {fields.some((f) => f.name === "phone") && (
                <InfoRow icon={Phone}>{user.phone || user.phone_number || "—"}</InfoRow>
              )}
              <InfoRow icon={Mail} className="break-all text-heading">
                {user.email || "—"}
                {emailVerified && <ShieldCheck size={16} className="text-emerald-600" title="Verified" />}
              </InfoRow>
              <InfoRow icon={CalendarDays} className="text-muted">Joined: {formatDate(user.created_at || user.joined_at) || "—"}</InfoRow>
              <InfoRow icon={Clock} className="text-muted">Last login: {formatDate(user.last_login_at || user.last_login) || "—"}</InfoRow>
            </div>
          )}
        </section>

        {/* Actions */}
        <section>
          <h4 className="mb-3 font-semibold text-heading">Administrative Actions</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {actions.map(({ key, Icon, label, disabled, onClick }) => (
              <button key={key} type="button" disabled={disabled || loading} onClick={onClick} className={buttonClass}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {isSelf && <p className="mt-3 text-xs text-muted">You can't suspend or change the role of your own account.</p>}
          {!isSelf && targetIsSuperAdmin && currentUserRole !== "super_admin" && (
            <p className="mt-3 text-xs text-muted">Only a Super Admin can manage this account.</p>
          )}
        </section>

        {/* Inline confirmation */}
        {confirmation && (
          <section className="rounded-lg border border-border bg-bg p-4">
            <p className="font-medium text-heading">{confirmation.label}?</p>
            <p className="mt-1 text-sm text-muted">Are you sure you want to continue with this change?</p>
            <div className="mt-4 flex gap-2">
              <button type="button" disabled={loading} onClick={handleConfirm} className="rounded-md bg-sidebar px-4 py-2 text-sm text-white disabled:opacity-50">
                Confirm
              </button>
              <button type="button" disabled={loading} onClick={() => setConfirmation(null)} className="rounded-md border border-border px-4 py-2 text-sm text-heading">
                Cancel
              </button>
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}