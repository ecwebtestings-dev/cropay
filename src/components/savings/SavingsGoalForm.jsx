import { useState } from "react";
import toast from "react-hot-toast";
import { Banknote, CalendarDays, Loader2, Target } from "lucide-react";

import InputField from "../common/InputFields";
import { validateGoal } from "../../validators/goal";

/**
 * Create / edit form.
 *  goal      : the goal being edited, or null/undefined to create a new one
 *  onSubmit  : async ({ name, targetAmount, deadline }) => void (throw to report a failure)
 *  onCancel  : closes the dialog
 */
export default function SavingsGoalForm({ goal, onSubmit, onCancel }) {
  const isEditing = Boolean(goal);
  const today = new Date().toISOString().slice(0, 10);

  const [values, setValues] = useState({
    name: goal?.name ?? "",
    targetAmount: goal ? String(goal.targetAmount) : "",
    deadline: goal?.deadline ?? "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateGoal(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name: values.name.trim(),
        targetAmount: Number(values.targetAmount),
        deadline: values.deadline,
      });
    } catch (error) {
      toast.error(error.message || "Could not save the goal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      <InputField
        label="Goal name"
        name="name"
        type="text"
        Icon={Target}
        placeholder="e.g. Harvestor"
        value={values.name}
        error={errors.name}
        onChange={handleChange}
        autoFocus
      />

      <InputField
        label="Target amount (UGX)"
        name="targetAmount"
        type="number"
        inputMode="numeric"
        min="1000"
        Icon={Banknote}
        placeholder="1000000"
        value={values.targetAmount}
        error={errors.targetAmount}
        onChange={handleChange}
      />

      <InputField
        label="Target date"
        name="deadline"
        type="date"
        min={today}
        Icon={CalendarDays}
        value={values.deadline}
        error={errors.deadline}
        onChange={handleChange}
      />

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-11 rounded-3xl border border-border px-6 text-sm font-semibold text-heading
            transition-colors hover:bg-bg disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="flex h-11 items-center justify-center gap-2 rounded-3xl bg-sidebar px-6 text-sm
            font-semibold text-white transition-colors hover:bg-primary-500
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Create goal"
          )}
        </button>
      </div>
    </form>
  );
}