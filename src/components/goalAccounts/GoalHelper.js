// Helpers that are specific to the savings goals feature. No React in here.
// Formatting, phone and goal-status helpers now come from your shared utils.
import { getGoalProgress, getGoalStatus } from "./goalStatus";

// Deposits with one of these statuses count towards a goal's progress.
const SUCCESS_WORDS = ["completed", "complete", "success", "succeeded", "successful", "paid", "active"];
const isSuccessful = (deposit) => SUCCESS_WORDS.includes(String(deposit.status ?? "").trim().toLowerCase());

// Accepts [...], { data: [...] }, { data: { data: [...] } } or named lists like { categories: [...] }
export function getList(response, ...names) {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  for (const name of names) {
    if (Array.isArray(data?.[name])) return data[name];
  }
  return [];
}

// Tomorrow as "YYYY-MM-DD" in the user's own time zone (the earliest allowed target date)
export function tomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA"); // en-CA prints YYYY-MM-DD
}

// Whole days from today until the date ("YYYY-MM-DD"). Negative = already passed.
function daysUntil(deadline) {
  if (!deadline) return null;
  const target = new Date(`${deadline}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

// Turns a goal from the API into the shape the screen uses.
// The field names targetAmount / savedAmount / deadline are what your getGoalStatus and getGoalProgress expect.
// "Saved" comes from the goal itself if the API sends it; otherwise we add up its successful deposits.
export function normalizeGoal(goal, deposits = []) {
  const targetAmount = Number(goal.target_amount ?? goal.target ?? 0) || 0;

  const savedFromApi = [goal.saved_amount, goal.current_amount, goal.total_deposited, goal.deposited_amount, goal.amount_saved]
    .find((value) => value !== undefined && value !== null && value !== "");

  const savedFromDeposits = deposits
    .filter((d) => String(d.saving_goal_id) === String(goal.id) && isSuccessful(d))
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const savedAmount = savedFromApi !== undefined ? Number(savedFromApi) || 0 : savedFromDeposits;

  // Keep only "YYYY-MM-DD", even if the API sends a full timestamp like "2026-12-31T00:00:00.000000Z"
  const deadline = goal.target_date ? String(goal.target_date).slice(0, 10) : "";

  const forUtils = { targetAmount, savedAmount, deadline };

  return {
    id: goal.id,
    title:
      goal.category?.name || goal.category_name || goal.saving_category?.name || goal.savings_category?.name || "Savings goal",
    description: goal.description || "",
    targetAmount,
    savedAmount,
    remaining: Math.max(0, targetAmount - savedAmount),
    deadline,
    daysLeft: daysUntil(deadline),
    status: getGoalStatus(forUtils),     // "completed" | "overdue" | "active"
    progress: getGoalProgress(forUtils), // 0-100
  };
}