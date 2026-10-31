import { useState } from "react";
import { Loader2, ShoppingBasket } from "lucide-react";
import Modal from "../../components/common/Modal";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60";

export default function SellProduceModal({ onClose, onCreated, onSubmit }) {
  const [form, setForm] = useState({
    produce: "",
    quantity: "",
    unit: "kg",
    price: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.produce.trim()) {
      setError("Enter the name of your produce.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (!onSubmit) {
      setError("The produce sales service has not been connected yet.");
      return;
    }

    try {
      setBusy(true);

      await onSubmit({
        produce: form.produce.trim(),
        quantity: Number(form.quantity),
        unit: form.unit,
        price: Number(form.price),
        description: form.description.trim(),
      });

      onCreated?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not submit your produce sale.",
      );
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      title="Record produce sale"
      onClose={busy ? () => {} : onClose}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl bg-orange-50 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange-100 text-orange-700">
              <ShoppingBasket size={21} />
            </span>

            <div>
              <p className="text-sm font-semibold text-heading">
                Record your farm earnings
              </p>
              <p className="mt-1 text-xs text-muted">
                Enter the details of your produce sale.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Produce name
          </label>
          <input
            value={form.produce}
            onChange={(e) => updateField("produce", e.target.value)}
            placeholder="e.g. Maize, beans, cassava"
            className={inputClass}
            disabled={busy}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={form.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
              placeholder="0"
              className={inputClass}
              disabled={busy}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">
              Unit
            </label>
            <select
              value={form.unit}
              onChange={(e) => updateField("unit", e.target.value)}
              className={inputClass}
              disabled={busy}
            >
              <option value="kg">Kilograms</option>
              <option value="bags">Bags</option>
              <option value="tonnes">Tonnes</option>
              <option value="pieces">Pieces</option>
              <option value="bunches">Bunches</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Selling price (UGX)
          </label>
          <input
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="Enter total selling price"
            className={inputClass}
            disabled={busy}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Additional information (Optional)
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Add any details about this sale..."
            className={`${inputClass} resize-none`}
            disabled={busy}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-heading hover:bg-bg disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Submitting..." : "Submit sale"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
