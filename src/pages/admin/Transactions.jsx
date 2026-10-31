import { getAdminDeposits } from "../../api/deposits";
import { getUsers } from "../../api/users";
import { getAdminSavingGoals } from "../../api/savingsAccounts";

import {
  fetchAllTransactions,
} from "../../components/transactions/fetchtransactions";

import TransactionsPage from "../../components/transactions/TransactionsPage";

// LOAD ALL TRANSACTIONS, USERS AND SAVINGS GOALS
async function loadAllTransactions(options = {}) {
  const [deposits, users, goals] = await Promise.all([
    fetchAllTransactions(getAdminDeposits, {
      ...options,
      label: "ADMIN DEPOSITS",
    }),

    fetchAllTransactions(getUsers, {
      ...options,
      label: "USERS",
    }),

    fetchAllTransactions(getAdminSavingGoals, {
      ...options,
      label: "SAVINGS GOALS",
    }),
  ]);

  if (options.isCancelled?.()) return [];

  // CREATE USER LOOKUP
  const usersById = new Map(
    users.map((user) => [String(user.id), user])
  );

  // CREATE SAVINGS GOAL LOOKUP
  const goalsById = new Map(
    goals.map((goal) => [String(goal.id), goal])
  );

  // ATTACH USER AND SAVINGS GOAL INFORMATION TO DEPOSITS
  return deposits.map((deposit) => {
    const user = usersById.get(String(deposit.user_id)) || null;

    const savingGoal =
      goalsById.get(String(deposit.saving_goal_id)) || null;

    return {
      ...deposit,
      user,
      saving_goal: savingGoal,

      goal_title:
        savingGoal?.category?.name ||
        savingGoal?.category_name ||
        savingGoal?.description ||
        savingGoal?.name ||
        "",
    };
  });
}

export default function AdminTransactions() {
  return (
    <TransactionsPage
      title="Payment Transactions"
      loadTransactions={loadAllTransactions}
      showUser
      showGoal
      emptyText="No transactions yet."
    />
  );
} 