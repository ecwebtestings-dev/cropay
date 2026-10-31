import { getDeposits } from "../../api/deposits";
import TransactionsPage from "../../components/transactions/TransactionsPage";
import { fetchAllTransactions } from "../../components/transactions/fetchtransactions";

// LOAD FARMER TRANSACTIONS.
async function loadMyTransactions(options = {}) {
  return fetchAllTransactions(getDeposits, options);
}

// FARMER TRANSACTIONS PAGE.
export default function FarmerTransactions() {
  return (
    <TransactionsPage
      title="My Transactions"
      subtitle="Every deposit you have made towards your savings goals."
      loadTransactions={loadMyTransactions}
      showGoal
      emptyText="You have not made any deposits yet. They will show up here."
    />
  );
}
