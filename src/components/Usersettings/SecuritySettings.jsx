import { useState } from "react";
import { UserRoundX, Loader2, AlertTriangle } from "lucide-react";

import InputField from "../../components/common/InputFields";
import Modal from "../../components/common/Modal";

import { changePassword, deleteAccount } from "../../api/settings";

// INITIAL PASSWORD FORM VALUES.
const INITIAL_PASSWORDS = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function SecuritySettings({ activeTab, showMessage }) {
  const [passwords, setPasswords] = useState({...INITIAL_PASSWORDS,});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //  SERVER VALIDATION ERRORS INTO FIELD ERRORS.
  const setServerErrors = (validationErrors) => {
    if (!validationErrors) return;
    const formattedErrors = {};
    Object.entries(validationErrors).forEach(([key, value]) => {
      formattedErrors[key] = Array.isArray(value) ? value[0] : value;
    });

    setErrors(formattedErrors);
  };

  // UPDATES PASSWORD INPUT VALUES
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((previous) => ({...previous,[name]: value,}));
    setErrors((previous) => ({...previous, [name]: ""}));
  };

  // SUBMITS PASSWORD CHANGES
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (
      !passwords.current_password ||
      !passwords.password ||
      !passwords.password_confirmation
    ) {
      showMessage("error", "Please complete all password fields.");
      return;
    }

    if (passwords.password.length < 8) {
      setErrors({
        password: "Password must be at least 8 characters.",
      });

      showMessage("error", "Please correct the password errors.");
      return;
    }

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

    if (passwords.password !== passwords.password_confirmation) {
      setErrors({
        password_confirmation: "Passwords do not match.",
      });

      showMessage("error", "Please correct the password errors.");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(passwords);
      setPasswords({ ...INITIAL_PASSWORDS });
      setErrors({});
      showMessage("success",response.data?.message ?? "Password changed successfully.",
      );
    } 
    catch (err) {
      setServerErrors(err.response?.data?.errors);
      showMessage("error",err.response?.data?.message ??"Failed to change password. Check your current password.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ACCOUNT DELETION CONFIRMATION MODAL
  const handleDeleteAccountClick = () => {
    setErrors({});
    setShowDeleteModal(true);
  };

  // DELETES THE ACCOUNT AFTER  CONFIRMATION.
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteAccount();
      setShowDeleteModal(false);
      showMessage("success",response.data?.message ??  "Your account deletion request was successful.",
      );
    } 
    catch (err) {
      showMessage("error",err.response?.data?.message ?? "Failed to delete your account.",);
      setShowDeleteModal(false);
    } 
    finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* CHANGE PASSWORD FORM. */}
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

            {loading ? "Updating" : "Change password"}
          </button>
        </form>
      )}

      {/* ACCOUNT DELETION */}
      {activeTab === "delete" && (
        <div className="max-w-xl space-y-4">
          <h2 className="text-base font-semibold">Delete Account</h2>

          <p className="text-sm text-muted">
            Deleting your account may permanently remove your access and
            associated data
          </p>

          <button
            type="button"
            onClick={handleDeleteAccountClick}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserRoundX size={16} />
            Delete my account
          </button>
        </div>
      )}

      {/* ACCOUNT DELETION CONFIRMATION MODAL */}
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

          {/* CANCEL AND CONFIRM ACTIONS. */}
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

              {deleting ? "Deleting..." : "Yes, delete account"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
