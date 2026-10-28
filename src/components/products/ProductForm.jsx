import { useEffect, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { createProduct, updateProduct } from "../../api/products";


//FORM DATA
const INITIAL_FORM = {name: "",description: "",unit: "Kg"};

function getErrorMessage(error) {
  const errors = error.response?.data?.errors;
  if (errors) { return Object.values(errors).flat().join(" ");}
  return ( error.response?.data?.message || "Unable to save the product. Please try again.");
}

export default function ProductFormModal({ open, product, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (!open) return;

    setForm(
      product
        ? {
            name: product.name || "",
            description: product.description || "",
            unit: product.unit || "Kg",
            is_active: product.is_active ?? true,
          }
        : INITIAL_FORM,
    );

    setError("");
  }, [open, product]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({...current, [name]: value,}));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Unit is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      unit: form.unit.trim(),
      is_active: form.is_active,
    };

    setSaving(true);

    try {
      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }

      await onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mt-1 text-sm text-muted">
              {isEditing}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className=" text-muted hover:cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">
              Product name 
            </label>
            <input
              id="product-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Agricultural produce name"
              required
              maxLength={255}
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-heading outline-none focus:border-sidebar"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              Description
            </label>
            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Describe this product"
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2.5 text-sm text-heading outline-none focus:border-sidebar"
            />
          </div>

          <div>
            <label
              htmlFor="product-unit"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              Measurement unit 
            </label>
            <input
              id="product-unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unit of purchase"
              required
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-heading outline-none focus:border-sibebar"
            />
          </div>

    

          {error && (
            <p className="text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-body disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-sidebar px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
