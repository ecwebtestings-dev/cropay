

//HELP FUNCTIONS
export const FILTERS = ["All", "Active", "Voided"];

export const DATE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
];

export const getStatus = (status) => String(status || "unknown").trim().toLowerCase();

const VOIDED = ["voided", "cancelled", "canceled", "reversed"];
const ACTIVE = ["active", "completed", "successful", "success", "paid"];

export const isVoided = (d) => VOIDED.includes(getStatus(d.status));
export const isActive = (d) => ACTIVE.includes(getStatus(d.status));


export function isWithinDate(dateValue, filter) {
  if (filter === "all") return true;
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  if (filter === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date >= start && date <= now;
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - (filter === "7days" ? 7 : 30));
  return date >= cutoff && date <= now;
}

//API EXCEPTION
export function extractRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.deposits)) return payload.deposits;
  throw new Error("The deposits API returned an unexpected response.");
}

export const sumAmounts = (list) => list.reduce((s, d) => s + (Number(d.amount) || 0), 0);