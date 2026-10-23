import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../../components/common/Modal"; 

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60";


export default function CategoryFormModal({ category, onSave, onClose }) {
  const isEdit = Boolean(category);

  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    const problems = {};
    if (!payload.name) problems.name = "Enter a category name.";
    if (!payload.description)
      problems.description = "Enter a short description.";

    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }

    try {
      setBusy(true);
      await onSave(payload); 
    } catch (error) {
      const serverErrors = error.response?.data?.errors || {};
      setErrors({
        name: serverErrors.name?.[0] || "",
        description: serverErrors.description?.[0] || "",
      });
      setFormError(
        error.response?.data?.message ||
          "Could not save the category. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      title={isEdit ? "Edit category" : "Add category"}
      onClose={busy ? () => {} : onClose}
      size="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Name
          </label>
          <input
            id="category-name"
            autoFocus
            value={form.name}
            onChange={handleChange("name")}
            disabled={busy}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "category-name-error" : undefined}
            className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p id="category-name-error" className="mt-1.5 text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category-description"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Description
          </label>
          <textarea
            id="category-description"
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            disabled={busy}
            placeholder="What do farmers save towards in this category?"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "category-description-error" : undefined
            }
            className={`${inputClass} resize-none ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p
              id="category-description-error"
              className="mt-1.5 text-xs text-red-500"
            >
              {errors.description}
            </p>
          )}
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-sidebar px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save changes" : "Add category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
