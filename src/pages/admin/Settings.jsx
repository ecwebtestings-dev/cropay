import { useEffect, useState } from "react";
import {
  UserRound,
  LockKeyhole,
  UserRoundX,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/common/InputFields";
import Modal from "../../components/common/Modal";

import {
  changePassword,
  updateUsernameOrEmail,
  deleteAccount,
} from "../../api/settings";

// SETTINGS TABS.
const TABS = [
  {
    id: "account",
    label: "Account Information",
    Icon: UserRound,
  },
  {
    id: "password",
    label: "Change Password",
    Icon: LockKeyhole,
  },
  {
    id: "delete",
    label: "Delete Account",
    Icon: UserRoundX,
  },
];

// INITIAL PASSWORD FORM VALUES.
const INITIAL_PASSWORDS = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  // STORES ACCOUNT INFORMATION.
  const [account, setAccount] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    ...INITIAL_PASSWORDS,
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // STORES THE DELETE CONFIRMATION MODAL STATE.
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // STORES INPUT VALIDATION ERRORS.
  const [errors, setErrors] = useState({});

  // STORES THE CURRENT TOAST NOTIFICATION.
  const [toast, setToast] = useState(null);

  // POPULATES ACCOUNT DETAILS FROM THE AUTHENTICATED USER.
  useEffect(() => {
    setAccount({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  }, [user]);

  // AUTOMATICALLY DISMISSES TOAST NOTIFICATIONS.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  // DISPLAYS A SUCCESS OR ERROR TOAST.
  const showMessage = (type, text) => {
    setToast({
      type,
      text,
      id: Date.now(),
    });
  };

  // CLEARS TOASTS AND FIELD ERRORS.
  const clearMessages = () => {
    setToast(null);
    setErrors({});
  };

  // CONVERTS SERVER VALIDATION ERRORS INTO FIELD ERRORS.
  const setServerErrors = (validationErrors) => {
    if (!validationErrors) return;

    const formattedErrors = {};

    Object.entries(validationErrors).forEach(([key, value]) => {
      formattedErrors[key] = Array.isArray(value) ? value[0] : value;
    });

    setErrors(formattedErrors);
  };

  // UPDATES ACCOUNT INPUT VALUES.
  const handleAccountChange = (event) => {
    const { name, value } = event.target;

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setToast(null);
  };

  // UPDATES PASSWORD INPUT VALUES.
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setToast(null);
  };

  // SUBMITS ACCOUNT INFORMATION UPDATES.
  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const name = account.name.trim();
    const email = account.email.trim().toLowerCase();

    const currentName = user?.name ?? "";
    const currentEmail = (user?.email ?? "").toLowerCase();

    const payload = {};
    const validationErrors = {};

    // VALIDATES AND ADDS THE NAME ONLY IF IT CHANGED.
    if (name !== currentName) {
      if (!name) {
        validationErrors.name = "Full name is required.";
      } else {
        payload.name = name;
      }
    }

    // VALIDATES AND ADDS THE EMAIL ONLY IF IT CHANGED.
    if (email !== currentEmail) {
      if (!email) {
        validationErrors.email = "Email address is required.";
      } else {
        payload.email = email;
      }
    }

    // SHOWS FIELD VALIDATION ERRORS.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showMessage("error", "Please correct the highlighted fields.");
      return;
    }

    // PREVENTS EMPTY UPDATE REQUESTS.
    if (Object.keys(payload).length === 0) {
      showMessage("error", "No changes have been made.");
      return;
    }

    try {
      setLoading(true);
      const response = await updateUsernameOrEmail(payload);

      //  UPDATED VALUES
      const updatedName = response.data?.new_name ?? name;
      const updatedEmail = response.data?.new_email ?? email;

      // PRESERVES EXISTING USER DATA.
      const updatedUser = {
        ...user,
        name: updatedName,
        email: updatedEmail,
      };
      // UPDATES AUTHCONTEXT.
      updateUser(updatedUser);
      setAccount({
        name: updatedName,
        email: updatedEmail,
      });

      // CLEARS FIELD ERRORS.
      setErrors({});

      // SHOWS THE SUCCESS TOAST.
      showMessage(
        "success",
        response.data?.message ?? "Account information updated successfully.",
      );
    } catch (err) {
      console.error("FAILED TO UPDATE ACCOUNT:", err);
      setServerErrors(err.response?.data?.errors);

      //GENERAL FAILURES
      showMessage(
        "error",
        err.response?.data?.message || "Failed to update account information.",
      );
    } finally {
      setLoading(false);
    }
  };

  // VALIDATES AND SUBMITS PASSWORD CHANGES.
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    // ENSURES ALL PASSWORD FIELDS ARE COMPLETED.
    if (
      !passwords.current_password ||
      !passwords.password ||
      !passwords.password_confirmation
    ) {
      showMessage("error", "Please complete all password fields.");
      return;
    }

    // VALIDATES THE MINIMUM PASSWORD LENGTH.
    if (passwords.password.length < 8) {
      setErrors({
        password: "Password must be at least 8 characters.",
      });

      showMessage("error", "Please correct the password errors.");
      return;
    }

    // REQUIRES AT LEAST ONE LETTER AND ONE NUMBER.
    if (
      !/[A-Za-z]/.test(passwords.password) ||
      !/[0-9]/.test(passwords.password)
    ) {
      setErrors({
        password: "Password must contain a letter and a number.",
      });

      showMessage("error", "Please correct the password errors.");
      return;
    }

    // ENSURES BOTH NEW PASSWORD VALUES MATCH.
    if (passwords.password !== passwords.password_confirmation) {
      setErrors({
        password_confirmation: "Passwords do not match.",
      });

      showMessage("error", "Please correct the password errors.");
      return;
    }

    try {
      setLoading(true);

      // SENDS THE PASSWORD CHANGE REQUEST.
      const response = await changePassword(passwords);

      // CLEARS PASSWORD VALUES AFTER SUCCESS.
      setPasswords({ ...INITIAL_PASSWORDS });

      showMessage(
        "success",
        response.data?.message ?? "Password changed successfully.",
      );
    } catch (err) {
      console.error("FAILED TO CHANGE PASSWORD:", err);

      // DISPLAYS SERVER VALIDATION ERRORS BESIDE INPUTS.
      setServerErrors(err.response?.data?.errors);

      showMessage(
        "error",
        err.response?.data?.message ??
          "Failed to change password. Check your current password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // OPENS THE ACCOUNT DELETION CONFIRMATION MODAL.
  const handleDeleteAccountClick = () => {
    clearMessages();
    setShowDeleteModal(true);
  };

  // DELETES THE ACCOUNT AFTER USER CONFIRMATION.
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      clearMessages();

      // SENDS THE ACCOUNT DELETION REQUEST.
      const response = await deleteAccount();

      setShowDeleteModal(false);

      showMessage(
        "success",
        response.data?.message ??
          "Your account deletion request was successful.",
      );
    } catch (err) {
      console.error("FAILED TO DELETE ACCOUNT:", err);

      showMessage(
        "error",
        err.response?.data?.message ?? "Failed to delete your account.",
      );

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6 text-foreground">
      {/* DISPLAYS GLOBAL TOAST NOTIFICATIONS. */}
      {toast && (
        <div
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg">
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0" />
            ) : (
              <XCircle size={20} className="shrink-0" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {toast.type === "success" ? "Success" : "Error"}
              </p>

              <p className="mt-1 break-words text-sm text-muted">
                {toast.text}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="rounded p-1 hover:bg-bg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* DISPLAYS THE SETTINGS PAGE HEADING. */}
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account and security preferences.
        </p>
      </div>

      {/* DISPLAYS THE SETTINGS NAVIGATION TABS. */}
      <div className="overflow-x-auto border-b border-border">
        <div className="flex min-w-max gap-6">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                clearMessages();
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm transition ${
                activeTab === id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTAINS THE ACTIVE SETTINGS FORM. */}
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        {/* DISPLAYS THE ACCOUNT INFORMATION FORM. */}
        {activeTab === "account" && (
          <form onSubmit={handleAccountSubmit} className="max-w-xl space-y-4">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Account Information</h2>
              <p className="mt-1 text-sm text-muted">
                Edit your name or email address below.
              </p>
            </div>

            <InputField
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              value={account.name}
              onChange={handleAccountChange}
              error={errors.name}
              autoComplete="name"
              required
            />

            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={account.email}
              onChange={handleAccountChange}
              error={errors.email}
              autoComplete="email"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        {/* DISPLAYS THE CHANGE PASSWORD FORM. */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-4">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Change Password</h2>
              <p className="mt-1 text-sm text-muted">
                Choose a strong password to keep your account secure.
              </p>
            </div>

            <InputField
              label="Current password"
              name="current_password"
              type="password"
              placeholder="Enter current password"
              value={passwords.current_password}
              onChange={handlePasswordChange}
              error={errors.current_password}
              autoComplete="current-password"
              required
            />

            <InputField
              label="New password"
              name="password"
              type="password"
              placeholder="Enter new password"
              value={passwords.password}
              onChange={handlePasswordChange}
              error={errors.password}
              autoComplete="new-password"
              required
            />

            <InputField
              label="Confirm new password"
              name="password_confirmation"
              type="password"
              placeholder="Confirm new password"
              value={passwords.password_confirmation}
              onChange={handlePasswordChange}
              error={errors.password_confirmation}
              autoComplete="new-password"
              required
            />

            <p className="-mt-2 text-xs text-muted">
              Use at least 8 characters, including a letter and a number.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Updating..." : "Change password"}
            </button>
          </form>
        )}

        {/* DISPLAYS THE ACCOUNT DELETION OPTION. */}
        {activeTab === "delete" && (
          <div className="max-w-xl space-y-4">
            <h2 className="text-base font-semibold">Delete Account</h2>

            <p className="text-sm text-muted">
              Deleting your account may permanently remove your access and
              associated data. Make sure you understand the consequences before
              continuing.
            </p>

            <button
              type="button"
              onClick={handleDeleteAccountClick}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRoundX size={16} />
              Delete my account
            </button>
          </div>
        )}
      </div>

      {/* DISPLAYS THE ACCOUNT DELETION CONFIRMATION MODAL. */}
      <Modal
        open={showDeleteModal}
        title="Confirm account deletion"
        onClose={() => {
          if (!deleting) setShowDeleteModal(false);
        }}
        size="max-w-md"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full border border-border p-2">
              <AlertTriangle size={22} />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">
                Are you sure you want to delete your account?
              </h3>

              <p className="text-sm text-muted">
                This action may be permanent. You could lose access to your
                account and its associated data. Make sure you want to continue
                before confirming.
              </p>
            </div>
          </div>

          {/* PROVIDES CANCEL AND CONFIRM ACTIONS. */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-bg disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting && <Loader2 size={15} className="animate-spin" />}
              {deleting ? "Deleting" : "Yes, delete account"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
