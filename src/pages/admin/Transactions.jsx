import { getAdminDeposits } from "../../api/deposits";
import { getUsers } from "../../api/users";
import { fetchAllPages } from "../../components/transactions/fetchtransactions";
import TransactionsPage from "../../components/transactions/TransactionsPage";


async function loadAllTransactions({ isCancelled, onProgress }) {
  
  let users = [];
  try {
    users = (await fetchAllPages(getUsers, { isCancelled })) ?? [];
  } catch (err) {
    console.error("Could not load users for transactions:", err);

  }

  if (isCancelled?.()) return null;

  const deposits = await fetchAllPages(getAdminDeposits, {
    isCancelled,
    onProgress,
  });
  if (!deposits) return null;

  const usersById = new Map(users.map((u) => [String(u.id), u]));

  return deposits.map((d) => ({
    ...d,
    user: d.user ?? usersById.get(String(d.user_id)) ?? null,
  }));
}

export default function AdminTransactions() {
  return (
    <TransactionsPage
      title="Payment Transactions"
      loadTransactions={loadAllTransactions}
      showUser
      emptyText="No transactions yet."
    />
  );
}
