import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import Modal from "../../components/common/Modal";
import { GetCategory } from "../../api/savingsCatergories";
import { MIN_GOAL_AMOUNT } from "../../utils/constraints"; 
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { createSavingsAccount } from "../../api/savingsAccounts";
import { getList, tomorrowISO } from "../goalAccounts/GoalHelper";

const STEPS = ["Goal details", "Account details", "Confirm"];

const inputClass =
  "w-full rounded-md border border-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60";

// Keeps only the digits the user typed: "1,000,000abc" -> "1000000"
const digitsOnly = (text) => text.replace(/\D/g, "");
const withCommas = (digits) =>
  digits ? Number(digits).toLocaleString("en-US") : "";

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-heading"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="max-w-[65%] break-words text-right font-medium text-heading">
        {value}
      </dd>
    </div>
  );
}

export default function CreateGoalWizard({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    categoryId: "",
    description: "",
    targetAmount: "",
    targetDate: "",
  });
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // The categories come from your database
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");
      const response = await GetCategory();
      setCategories(getList(response, "categories"));
    } catch (error) {
      setCategoriesError(
        error.response?.data?.message || "Could not load the categories.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const setField = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSaveError("");
  };

  // Checks the fields of one step. Returns an object of messages (empty = all good).
  const validateStep = (stepNumber) => {
    const problems = {};

    if (stepNumber === 1) {
      if (!form.categoryId) problems.categoryId = "Choose a savings category.";
      if (form.description.trim().length < 3)
        problems.description = "Write a short description of your goal.";
    }

    if (stepNumber === 2) {
      if (!form.targetAmount || Number(form.targetAmount) < MIN_GOAL_AMOUNT) {
        problems.targetAmount = `The target must be at least ${formatCurrency(MIN_GOAL_AMOUNT)}.`;
      }
      if (!form.targetDate)
        problems.targetDate = "Choose the date you want to reach your goal.";
      else if (form.targetDate < tomorrowISO())
        problems.targetDate = "Choose a date in the future.";
    }

    return problems;
  };

  const goNext = () => {
    const problems = validateStep(step);
    setErrors(problems);
    if (Object.keys(problems).length === 0) setStep(step + 1);
  };

  const goBack = () => {
    setErrors({});
    setSaveError("");
    setStep(step - 1);
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);
      setSaveError("");

      await createSavingsAccount({
        category_id: form.categoryId,
        description: form.description.trim(),
        target_amount: Number(form.targetAmount),
        target_date: form.targetDate,
      });

      onCreated(); // the page shows a message, closes this window and reloads the goals
    } catch (error) {
      const fieldMessages = Object.values(error.response?.data?.errors || {})
        .flat()
        .join(" ");
      setSaveError(
        fieldMessages ||
          error.response?.data?.message ||
          "Could not save your goal. Please try again.",
      );
      setSaving(false);
    }
  };

  const chosenCategory = categories.find(
    (c) => String(c.id) === String(form.categoryId),
  );

  return (
    <Modal
      open
      title="Create a savings goal"
      onClose={saving ? () => {} : onClose}
      size="max-w-md"
    >
      {/* Step indicator */}
      <ol className="mb-6 grid grid-cols-3 gap-2">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const reached = number <= step;
          return (
            <li key={label} aria-current={number === step ? "step" : undefined}>
              <div
                className={`h-1.5 rounded-full ${reached ? "bg-muted" : "bg-bg"}`}
              />
            </li>
          );
        })}
      </ol>

      {/*  Goal details  */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Please create your savings goal</p>

          <Field
            id="goal-category"
            label="Goal Catergory"
            error={errors.categoryId}
          >
            {categoriesError ? (
              <p className="text-sm text-red-600">
                {categoriesError}{" "}
                <button
                  type="button"
                  onClick={loadCategories}
                  className="font-medium underline"
                >
                  Try again
                </button>
              </p>
            ) : 
            
            (
              <div className="relative">
                <select
                  id="goal-category"
                  value={form.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                  disabled={categoriesLoading}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading "
                      : "Select a savings category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            )}
          </Field>

          <Field
            id="goal-description"
            label="What are you saving towards?"
            error={errors.description}
            hint={`${form.description.length}/20`}
          >
            <textarea
              id="goal-description"
              placeholder="What are you savings towards"
              rows={3}
              maxLength={20}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      )}




      {/*  Account details  */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-sidebar">
            Please enter the account details
          </p>

          <Field
            id="goal-amount"
            label="Target amount"
            error={errors.targetAmount}
            hint="How much do you need to reach your goal?"
          >
            <div className="flex overflow-hidden rounded-md border border-border bg-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <span className="grid place-items-center border-r border-border px-3 text-sm text-muted">
                UGX
              </span>
              <input
                id="goal-amount"
                inputMode="numeric"
                autoComplete="off"
                value={withCommas(form.targetAmount)}
                onChange={(e) =>
                  setField("targetAmount", digitsOnly(e.target.value))
                }
                placeholder="Enter an amount"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground outline-none"
              />
            </div>
          </Field>

          <Field
            id="goal-date"
            label="Target date (Optional)"
            error={errors.targetDate}
            hint="Date when you want to reach your target amount"
          >
            <input
              id="goal-date"
              type="date"
              min={tomorrowISO()}
              value={form.targetDate}
              onChange={(e) => setField("targetDate", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {/* COMFIRMATION*/}
      {step === 3 && (
        <div>
          <p className="text-sm text-sidebar">
            Please review your entered details before submiting
          </p>

          <dl className="mt-3 px-1">
            <SummaryRow
              label="Goal category"
              value={chosenCategory?.name || "—"}
            />
  
            <SummaryRow
              label="Target amount"
              value={formatCurrency(form.targetAmount)}
            />
            <SummaryRow
              label="Target date"
              value={formatDate(form.targetDate) || "—"}
            />
          </dl>

          {saveError && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {saveError}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {step === 1 ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-heading hover:bg-bg"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={goBack}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-heading hover:bg-bg disabled:opacity-60"
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={step === 1 && categoriesLoading}
            className="rounded-lg bg-sidebar px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-sidebar px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Confirm & Save
          </button>
        )}
      </div>
    </Modal>
  );
}
