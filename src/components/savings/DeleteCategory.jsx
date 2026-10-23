
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../../components/common/Modal";

export default function DeleteCategoryDialog({ category, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setBusy(true);
      setError("");
      await onConfirm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the category. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      title="Delete category?"
      onClose={busy ? () => {} : onClose}
      size="max-w-sm"
    >
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted">
          Are you sure you wantg to delete the record?.These process cant be undone
        </p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-3 flex justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-md text-sm hover:cursor-pointer disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md text-orange-600 hover:cursor-pointer disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Delete 
        </button>
      </div>
    </Modal>
  );
}

