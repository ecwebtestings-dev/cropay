import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import Modal from "../../components/common/Modal";
import { createDeposit } from "../../api/deposits";
import { MIN_DEPOSIT_AMOUNT } from "../../utils/constraints";
import { isValidMobileNumber, toLocalPhone } from "../../utils/mobileMoney";
import { formatCurrency } from "../../utils/formatCurrency";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60";


const digitsOnly = (text) => text.replace(/\D/g, "");


const withCommas = (digits) =>
  digits ? Number(digits).toLocaleString("en-US") : "";

const findPaymentUrl = (response) =>
  response?.data?.payment_url ||
  response?.data?.data?.payment_url ||
  response?.data?.redirect_url ||
  response?.data?.data?.redirect_url ||
  response?.data?.checkout_url ||
  response?.data?.data?.checkout_url ||
  "";

export default function DepositModal({ goal, defaultPhone, onClose }) {
  // The modal is only mounted while it is open, so starting with defaultPhone is enough.
  const [phone, setPhone] = useState(defaultPhone || "");
  const [amount, setAmount] = useState(""); // digits only, e.g. "50000"
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    if (!busy) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problems = {};
    const numericAmount = Number(amount);

    if (!phone.trim() || !isValidMobileNumber(phone)) {
      problems.phone = "Enter a valid mobile money phone number.";
    }

    if (
      amount === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      problems.amount = "Enter an amount to deposit.";
    } else if (numericAmount < MIN_DEPOSIT_AMOUNT) {
      problems.amount = `Minimum deposit is ${formatCurrency(MIN_DEPOSIT_AMOUNT)}.`;
    }

    setErrors(problems);
    setSubmitError("");

    if (Object.keys(problems).length > 0) return;

    try {
      setBusy(true);

      const response = await createDeposit(goal.id, {
        amount: numericAmount,
        phone: toLocalPhone(phone),
      });

      const paymentUrl = findPaymentUrl(response);

      if (!paymentUrl) {
        throw new Error("The payment provider did not return a checkout URL.");
      }

      const parsedUrl = new URL(paymentUrl);

      if (parsedUrl.protocol !== "https:") {
        throw new Error("The payment URL is invalid.");
      }

      window.open(parsedUrl.href, "_blank", "noopener,noreferrer");
    } catch (error) {
      const responseData = error?.response?.data;
      const fieldMessages = Object.values(responseData?.errors || {})
        .flat()
        .join(" ");

      setSubmitError(
        fieldMessages ||
          responseData?.message ||
          error?.userMessage ||
          error?.message ||
          "Could not start the payment. Please try again.",
      );

      setBusy(false);
    }
  };

  return (
    <Modal open title="Add savings" onClose={handleClose} size="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* PHONE NUMBER */}
        <div>
          <label
            htmlFor="deposit-phone"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Mobile money phone number
          </label>

          <div className="relative">
            <Smartphone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              id="deposit-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setErrors((previous) => ({ ...previous, phone: "" }));
              }}
              disabled={busy}
              autoComplete="tel"
              placeholder="+256700123456"
              aria-invalid={Boolean(errors.phone)}
              className={`${inputClass} pl-10 ${errors.phone ? "border-red-500" : ""}`}
            />
          </div>

          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* DEPOSIT AMOUNT */}
        <div>
          <label
            htmlFor="deposit-amount"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Deposit amount
          </label>

          <div
            className={`flex overflow-hidden rounded-md border bg-card focus-within:ring-1 focus-within:ring-primary ${
              errors.amount
                ? "border-red-500"
                : "border-border focus-within:border-primary"
            }`}
          >
            <span className="grid place-items-center border-r border-border px-3 text-sm font-medium text-muted">
              UGX
            </span>

            <input
              id="deposit-amount"
              name="amount"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={withCommas(amount)}
              onChange={(event) => {
                setAmount(digitsOnly(event.target.value));
                setErrors((previous) => ({ ...previous, amount: "" }));
              }}
              disabled={busy}
              placeholder="Enter amount"
              aria-invalid={Boolean(errors.amount)}
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {errors.amount && (
            <p className="mt-1.5 text-xs text-red-500">{errors.amount}</p>
          )}

          <p className="mt-1.5 text-xs text-muted">
            Minimum deposit: {formatCurrency(MIN_DEPOSIT_AMOUNT)}
          </p>
        </div>

        {/* SUBMISSION ERROR */}
        {submitError && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {submitError}
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-heading hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-sidebar px-3 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Processing..." : "Proceed to pay"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
