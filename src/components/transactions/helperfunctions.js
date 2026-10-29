


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


// DEPOSIT USER INOFRMATION

export function normalizeDeposit(deposit) {
  const user = deposit.user ?? {};
  const profile = user.profile ?? {};

  return {
    id: deposit.id,
    direction: "deposit",
    amount: Number(deposit.amount) || 0,
    reference: deposit.reference || "",
    gatewayRef: deposit.pesapal_tracking_id || "",
    provider: deposit.payment_method || "Pesapal",
    statusKey: getStatusKey(deposit.status),
    statusText: deposit.status || "",
    createdAt: deposit.created_at,
    updatedAt: deposit.updated_at,

    userId: deposit.user_id || "",
    userName: user.name || "-",
    username: user.username || "",
   

    // PHONE NUMBER USED FOR THIS TRANSACTION.
    depositorPhone:
      deposit.phone_number ||
      deposit.phone ||
      "Not provided",

    // USER'S REGISTERED PHONE NUMBER.
    accountPhone:
      user.phone ||
      profile.phone ||
      "Not provided",

    goalId: deposit.saving_goal_id || "",
    goalName:
      deposit.goal_title ||
      deposit.saving_goal?.category?.name ||
      deposit.saving_goal?.description ||
      "",

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

