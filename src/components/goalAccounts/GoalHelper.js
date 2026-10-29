
import { getGoalProgress, getGoalStatus } from "./goalStatus";

// DEPOSIT STATUSES 
const SUCCESSFUL_DEPOSIT_STATUSES = new Set([
  "completed",
  "complete",
  "success",
  "succeeded",
  "successful",
  "paid",
  "active",
]);

const SAVED_AMOUNT_FIELDS = [
  "saved_amount",
  "current_amount",
  "total_deposited",
  "deposited_amount",
  "amount_saved",
];

// EXTRACT ARRAY FROM A COMMON API 
export function getList(response, ...listNames) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.data)) {
    return data.data.data;
  }

  for (const name of listNames) {
    if (Array.isArray(data?.[name])) {
      return data[name];
    }
  }

  return [];
}

// CHECK WHETHER A DEPOSIT COUNTS TOWARD SAVINGS PROGRESS
function isSuccessfulDeposit(deposit) {
  const status = String(deposit?.status ?? "")
    .trim()
    .toLowerCase();

  return SUCCESSFUL_DEPOSIT_STATUSES.has(status);
}

// CONVERT A VALUE TO A VALID NUMBER
function toAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

// GET THE SAVED AMOUNT FROM THE GOAL
function getSavedAmountFromGoal(goal) {
  for (const field of SAVED_AMOUNT_FIELDS) {
    const value = goal?.[field];

    if (value !== undefined && value !== null && value !== "") {
      return toAmount(value);
    }
  }

  return null;
}

// CALCULATE SAVINGS FROM SUCCESSFUL DEPOSITS
function calculateDepositsTotal(goalId, deposits) {
  return deposits
    .filter(
      (deposit) =>
        String(deposit?.saving_goal_id) === String(goalId) &&
        isSuccessfulDeposit(deposit),
    )
    .reduce((total, deposit) => total + toAmount(deposit.amount), 0);
}

// RETURN TOMORROW AS YYYY-MM-DD
export function tomorrowISO() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// CALCULATE THE NUMBER OF DAYS UNTIL A DEADLINE
function daysUntil(deadline) {
  if (!deadline) {
    return null;
  }

  const targetDate = new Date(`${deadline}T00:00:00`);
  
  if (Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((targetDate.getTime() - today.getTime()) / 86400000);
}


// NORMALIZE AN API SAVINGS GOAL
export function normalizeGoal(goal, deposits = []) {
  const targetAmount = toAmount(goal?.target_amount ?? goal?.target);
  const savedAmountFromApi = getSavedAmountFromGoal(goal);
  const savedAmount =
    savedAmountFromApi !== null
      ? savedAmountFromApi
      : calculateDepositsTotal(goal?.id, deposits);

  const deadline = goal?.target_date? String(goal.target_date).slice(0, 10): "";
  const normalizedGoal = {targetAmount,savedAmount,deadline,};

  return {
    id: goal?.id,
    title:
      goal?.category?.name ||
      goal?.category_name ||
      goal?.saving_category?.name ||
      goal?.savings_category?.name ||
      "Savings goal",
    description: goal?.description ?? "",
    targetAmount,
    savedAmount,
    remaining: Math.max(0, targetAmount - savedAmount),
    deadline,
    daysLeft: daysUntil(deadline),
    status: getGoalStatus(normalizedGoal),
    progress: getGoalProgress(normalizedGoal),
  };
}
