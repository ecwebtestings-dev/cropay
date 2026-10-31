import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import Modal from "../../components/common/Modal";
import { GetCategory } from "../../api/savingsCatergories";
import { createSavingsAccount } from "../../api/savingsAccounts";

import { MIN_GOAL_AMOUNT } from "../../utils/constraints";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getList, tomorrowISO } from "../goalAccounts/GoalHelper";

const STEPS = ["Goal details", "Account details", "Confirm"];

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

// KEEP ONLY NUMERIC CHARACTERS
const digitsOnly = (value) => value.replace(/\D/g, "");

// FORMAT AMOUNT WITH THOUSANDS SEPARATORS
const withCommas = (digits) =>
  digits ? Number(digits).toLocaleString("en-US") : "";

// REUSABLE FORM FIELD
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

      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

// REUSABLE CONFIRMATION ROW
function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 text-sm last:border-0">
      <dt className="shrink-0 text-muted">{label}</dt>

      <dd className="max-w-[65%] break-words text-right font-medium text-heading">
        {value}
      </dd>
    </div>
  );
}

export default function CreateGoalWizard({ onClose, onCreated }) {
  const [step, setStep] = useState(1);

  // FORM DATA
  const [form, setForm] = useState({
    categoryId: "",
    description: "",
    targetAmount: "",
    targetDate: "",
  });

  // FORM VALIDATION
  const [errors, setErrors] = useState({});

  // CATEGORY DATA
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // SUBMISSION STATE
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // LOAD SAVINGS CATEGORIES FROM THE DATABASE
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const response = await GetCategory();

      setCategories(getList(response, "categories"));
    } catch (error) {
      setCategoriesError(
        error.response?.data?.message ||
          "Could not load savings categories. Please try again.",
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // UPDATE FORM FIELDS
  const setField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSaveError("");
  };

  // VALIDATE THE CURRENT STEP
  const validateStep = (stepNumber) => {
    const problems = {};

    if (stepNumber === 1) {
      if (!form.categoryId) {
        problems.categoryId = "Choose a savings category.";
      }

      if (form.description.trim().length < 3) {
        problems.description =
          "Enter at least 3 characters describing your goal.";
      }
    }

    if (stepNumber === 2) {
      const targetAmount = Number(form.targetAmount);

      if (
        !form.targetAmount ||
        !Number.isFinite(targetAmount) ||
        targetAmount < MIN_GOAL_AMOUNT
      ) {
        problems.targetAmount = `The target amount must be at least ${formatCurrency(
          MIN_GOAL_AMOUNT,
        )}.`;
      }

      // ONLY VALIDATE THE DATE WHEN THE USER PROVIDES ONE
      if (form.targetDate && form.targetDate < tomorrowISO()) {
        problems.targetDate = "Choose a date in the future.";
      }
    }

    return problems;
  };

  // MOVE TO THE NEXT STEP
  const goNext = () => {
    const problems = validateStep(step);

    setErrors(problems);

    if (Object.keys(problems).length === 0) {
      setStep((previous) => previous + 1);
    }
  };

  // RETURN TO THE PREVIOUS STEP
  const goBack = () => {
    setErrors({});
    setSaveError("");

    setStep((previous) => Math.max(1, previous - 1));
  };

  // CREATE THE SAVINGS GOAL
  const handleConfirm = async () => {
    try {
      setSaving(true);
      setSaveError("");

      await createSavingsAccount({
        category_id: form.categoryId,
        description: form.description.trim(),
        target_amount: Number(form.targetAmount),

        // SEND NULL WHEN NO TARGET DATE WAS SELECTED
        target_date: form.targetDate || null,
      });

      // NOTIFY THE PARENT COMPONENT THAT THE GOAL WAS CREATED
      onCreated?.();
    } catch (error) {
      const fieldMessages = Object.values(error.response?.data?.errors || {})
        .flat()
        .filter(Boolean)
        .join(" ");

      setSaveError(
        fieldMessages ||
          error.response?.data?.message ||
          error.message ||
          "Could not save your goal. Please try again.",
      );

      setSaving(false);
    }
  };

  // FIND THE SELECTED CATEGORY
  const chosenCategory = categories.find(
    (category) => String(category.id) === String(form.categoryId),
  );

  return (
    <Modal
      open
      title="Create a savings goal"
      onClose={saving ? () => {} : onClose}
      size="max-w-md"
    >
      {/* STEP INDICATOR */}
      <div className="mb-6">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((label, index) => {
            const number = index + 1;
            const reached = number <= step;

            return (
              <li
                key={label}
                aria-current={number === step ? "step" : undefined}
              >
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    reached ? "bg-primary" : "bg-bg"
                  }`}
                />

                <p
                  className={`mt-2 text-center text-xs ${
                    number === step
                      ? "font-semibold text-heading"
                      : "text-muted"
                  }`}
                >
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* STEP 1: GOAL DETAILS */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-heading">
              Tell us about your savings goal
            </h3>

            <p className="mt-1 text-xs text-muted">
              Choose a category and describe what you are saving towards.
            </p>
          </div>

          {/* SAVINGS CATEGORY */}
          <Field
            id="goal-category"
            label="Goal category"
            error={errors.categoryId}
          >
            {categoriesError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>{categoriesError}</p>

                <button
                  type="button"
                  onClick={loadCategories}
                  className="mt-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  id="goal-category"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={(event) =>
                    setField("categoryId", event.target.value)
                  }
                  disabled={categoriesLoading}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a savings category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categoriesLoading ? (
                  <Loader2
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                )}
              </div>
            )}
          </Field>

          {/* GOAL DESCRIPTION */}
          <Field
            id="goal-description"
            label="What are you saving towards?"
            error={errors.description}
            hint={`${form.description.length}/100 characters`}
          >
            <textarea
              id="goal-description"
              name="description"
              placeholder="e.g. Buying a dairy cow, farm equipment or land"
              rows={3}
              maxLength={100}
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      )}

      {/* STEP 2: ACCOUNT DETAILS */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-heading">
              Set your savings target
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted">
              Choose how much you would like to save. You can continue
              depositing even after reaching this target.
            </p>
          </div>

          {/* TARGET AMOUNT */}
          <Field
            id="goal-amount"
            label="Target amount"
            error={errors.targetAmount}
            hint={`Your target should be at least ${formatCurrency(
              MIN_GOAL_AMOUNT,
            )}.`}
          >
            <div
              className={`flex overflow-hidden rounded-lg border bg-card focus-within:ring-1 focus-within:ring-primary ${
                errors.targetAmount
                  ? "border-red-500"
                  : "border-border focus-within:border-primary"
              }`}
            >
              <span className="grid place-items-center border-r border-border bg-bg/60 px-4 text-sm font-medium text-muted">
                UGX
              </span>

              <input
                id="goal-amount"
                name="targetAmount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={withCommas(form.targetAmount)}
                onChange={(event) =>
                  setField("targetAmount", digitsOnly(event.target.value))
                }
                placeholder="Enter target amount"
                aria-invalid={Boolean(errors.targetAmount)}
                className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none"
              />
            </div>
          </Field>

          {/* OPTIONAL TARGET DATE */}
          <Field
            id="goal-date"
            label="Target date (Optional)"
            error={errors.targetDate}
            hint="You can leave this blank if you do not have a specific deadline."
          >
            <input
              id="goal-date"
              name="targetDate"
              type="date"
              min={tomorrowISO()}
              value={form.targetDate}
              onChange={(event) => setField("targetDate", event.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="rounded-lg border border-primary/15 bg-primary/5 p-3">
            <p className="text-xs leading-5 text-muted">
              <span className="font-semibold text-heading">
                Flexible savings:
              </span>{" "}
              Your target amount and date are guides, not limits. You can save
              at your own pace and continue adding money whenever you want.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
        <div>
          <div>
            <h3 className="text-sm font-semibold text-heading">
              Review your savings goal
            </h3>

            <p className="mt-1 text-xs text-muted">
              Check the details below before creating your goal.
            </p>
          </div>

          <dl className="mt-4 rounded-lg border border-border px-3">
            <SummaryRow
              label="Goal category"
              value={chosenCategory?.name || "—"}
            />

            <SummaryRow
              label="Description"
              value={form.description.trim() || "—"}
            />

            <SummaryRow
              label="Target amount"
              value={formatCurrency(Number(form.targetAmount))}
            />

            <SummaryRow
              label="Target date"
              value={
                form.targetDate ? formatDate(form.targetDate) : "No target date"
              }
            />
          </dl>

          {saveError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
            >
              {saveError}
            </p>
          )}
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
        {step === 1 ? (
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-bg disabled:opacity-60"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={goBack}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-bg disabled:opacity-60"
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={
              (step === 1 && categoriesLoading) ||
              (step === 1 && Boolean(categoriesError))
            }
            className="rounded-lg bg-sidebar px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sidebar px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}

            {saving ? "Creating goal..." : "Confirm & Save"}
          </button>
        )}
      </div>
    </Modal>
  );
}
