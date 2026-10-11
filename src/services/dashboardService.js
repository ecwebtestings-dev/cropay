// import api from "./api";
import { getSavingsGoals } from "./savingsService";
import { getGoalStatus } from "../utils/goalStatus";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

/**
 * Everything the farmer dashboard needs, in one object.
 * This is the shape the components expect (camelCase).
 *
 * TODO (real API): replace the mock below with
 *   const { data } = await api.get("/farmer/dashboard");
 *   return normalizeDashboard(data);
 * and write normalizeDashboard() to rename Laravel's snake_case fields
 * (e.g. total_savings -> totalSavings) so the components never change.
 */
export async function getFarmerDashboard() {
  await delay();

  // Same goals the Savings Goals page shows, so the two screens always agree.
  const allGoals = await getSavingsGoals();
  const totalSaved = allGoals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = allGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return {
    stats: {
      totalSavings: {
        value: totalSaved,
        change: 12.5,
        progress: totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0,
      },
      totalDeposits: { value: 250000, change: 8.4, progress: 68 },
      produceSales: { value: 720000, change: -2.3, progress: 60 },
      totalTransactions: { value: 12, change: 3, progress: 75 },
    },

    // The dashboard shows up to three goals that are still in progress.
    goals: allGoals.filter((goal) => getGoalStatus(goal) !== "completed").slice(0, 3),

    activity: [
      { id: 1, type: "deposit", message: "Deposit received: UGX 50,000", createdAt: minutesAgo(120) },
      { id: 2, type: "produce_sale", message: "Produce sale recorded: UGX 120,000", createdAt: minutesAgo(300) },
      { id: 3, type: "goal", message: "Goal updated: Farm Expansion", createdAt: minutesAgo(1440) },
      { id: 4, type: "profile", message: "Profile information updated", createdAt: minutesAgo(2880) },
    ],

    transactions: [
      { id: 1, type: "deposit", amount: 50000, createdAt: "2026-10-08T10:24:00Z", status: "completed" },
      { id: 2, type: "produce_sale", amount: 120000, createdAt: "2026-10-07T16:12:00Z", status: "completed" },
      { id: 3, type: "deposit", amount: 30000, createdAt: "2026-10-05T09:30:00Z", status: "pending" },
      { id: 4, type: "withdrawal", amount: 20000, createdAt: "2026-10-03T14:05:00Z", status: "failed" },
    ],
  };
}