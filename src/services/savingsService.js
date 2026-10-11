// import api from "./api";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── MOCK DATA (delete this block when the real API is connected) ───
let mockGoals = [
  { id: 1, name: "School Fees", targetAmount: 1000000, savedAmount: 480000, deadline: "2027-01-15" },
  { id: 2, name: "Farm Expansion", targetAmount: 2000000, savedAmount: 700000, deadline: "2027-06-30" },
  { id: 3, name: "Emergency Fund", targetAmount: 500000, savedAmount: 500000, deadline: "2026-12-31" },
];
// ────────────────────────────────────────────────────────────────────

/**
 * Goal shape used by the components:
 *   { id, name, targetAmount, savedAmount, deadline: "YYYY-MM-DD" }
 *
 * TODO (real API), for example:
 *   getSavingsGoals:  const { data } = await api.get("/savings-goals");            return data.data;
 *   createSavingsGoal: const { data } = await api.post("/savings-goals", values);   return data.data;
 *   updateSavingsGoal: const { data } = await api.put(`/savings-goals/${id}`, values); return data.data;
 *   deleteSavingsGoal: await api.delete(`/savings-goals/${id}`);
 * Laravel sends snake_case (target_amount), so map the fields in one place here.
 */

export async function getSavingsGoals() {
  await delay();
  return mockGoals.map((goal) => ({ ...goal }));
}

export async function createSavingsGoal({ name, targetAmount, deadline }) {
  await delay();

  const goal = { id: Date.now(), name, targetAmount, savedAmount: 0, deadline };
  mockGoals = [goal, ...mockGoals];
  return { ...goal };
}

export async function updateSavingsGoal(id, { name, targetAmount, deadline }) {
  await delay();

  const existing = mockGoals.find((goal) => goal.id === id);
  if (!existing) throw new Error("This goal no longer exists.");

  const updated = { ...existing, name, targetAmount, deadline };
  mockGoals = mockGoals.map((goal) => (goal.id === id ? updated : goal));
  return { ...updated };
}

export async function deleteSavingsGoal(id) {
  await delay();
  mockGoals = mockGoals.filter((goal) => goal.id !== id);
}