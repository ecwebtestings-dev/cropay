

export const DIRECTION_OPTIONS = [
  { value: "all", label: "All directions" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];


const STATUS_WORDS = {
  success: ["completed", "complete", "success", "succeeded", "successful", "paid", "active"],
  failed: ["failed", "failure", "cancelled", "canceled", "voided", "reversed", "rejected", "expired"],
  pending: ["pending", "initiated", "awaiting", "created", "new"],
  processing: ["processing", "in_progress"],
};

export function getStatusKey(rawStatus) {
  const word = String(rawStatus ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");

  for (const [key, words] of Object.entries(STATUS_WORDS)) {
    if (words.includes(word)) return key;
  }
  return "other"; 
}

// NORMALIZE DEPOSIT DATA FOR THE TRANSACTIONS TABLE
export function normalizeDeposit(deposit) {
  const user = deposit.user ?? {};
  const savingGoal = deposit.saving_goal ?? {};

  return {
    id: deposit.id,

    // TRANSACTION DIRECTION
    direction: "deposit",

    // TRANSACTION AMOUNT
    amount: Number(deposit.amount) || 0,

    // REFERENCES
    reference: deposit.reference || "",
    gatewayRef: deposit.pesapal_tracking_id || "",

    // PAYMENT INFORMATION
    provider: deposit.payment_method || "Pesapal",
    depositorPhone: deposit.phone_number || "",

    // TRANSACTION STATUS
    statusKey: getStatusKey(deposit.status),
    statusText: deposit.status || "",

    // DATES
    createdAt: deposit.created_at,
    updatedAt: deposit.updated_at,

    // ACCOUNT OWNER
    userId: deposit.user_id || user.id || "",
    userName: user.name || "Unknown user",
    userPhone: user.phone || "",

    // SAVINGS GOAL
    goalId: deposit.saving_goal_id || savingGoal.id || "",
    goalName:
      savingGoal.category?.name ||
      savingGoal.description ||
      savingGoal.name ||
      "No goal specified",

    // ORIGINAL API RESPONSE
    raw: deposit,
  };
}


export function shortRef(reference) {
  if (!reference) return "—";
  return reference.length > 14 ? `${reference.slice(0, 8)}…${reference.slice(-4)}` : reference;
}


export function formatDateTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

