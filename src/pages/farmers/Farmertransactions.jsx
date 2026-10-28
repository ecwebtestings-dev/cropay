import { getDeposits } from "../../api/deposits";
import { getSavingsAccount } from "../../api/savingsAccounts";
import { fetchAllPages } from "../../components/transactions/fetchtransactions";
import TransactionsPage from "../../components/transactions/TransactionsPage";

const goalTitleOf = (goal) =>
  goal.category?.name ||
  goal.category_name ||
  goal.description ||
  "Savings goal";

// Defined OUTSIDE the component so it is the same function on every render
async function loadMyTransactions(options) {
  const [deposits, goalsResponse] = await Promise.all([
    fetchAllPages(getDeposits, options),
    getSavingsAccount().catch(() => null), // goal names are a nice extra, so the list still works without them
  ]);

  if (!deposits) return null; // cancelled

  // Deposits only carry a goal ID, so look the goal's name up from the farmer's goals
  const data = goalsResponse?.data;
  const goals = Array.isArray(data)
    ? data
    : (data?.data?.data ?? data?.data ?? []);
  const titles = new Map(
    (Array.isArray(goals) ? goals : []).map((goal) => [
      String(goal.id),
      goalTitleOf(goal),
    ]),
  );

  return deposits.map((deposit) => ({
    ...deposit,
    goal_title: titles.get(String(deposit.saving_goal_id)) || "",
  }));
}

// Farmer
export default function FarmerTransactions() {
  return (
    <TransactionsPage
      title=""
      subtitle="Every deposit you have made towards your savings goals."
      loadTransactions={loadMyTransactions}
      showGoal
      emptyText="You have not made any deposits yet. They will show up here."
      exportFileName="my-transactions.csv"
    />
  );
}
