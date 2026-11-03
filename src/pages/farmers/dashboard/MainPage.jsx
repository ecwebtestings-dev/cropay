import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../../context/AuthContext";
import { getDeposits } from "../../../api/deposits";
import { getSavingsAccount } from "../../../api/savingsAccounts";
import { fetchAllTransactions } from "../../../components/transactions/fetchtransactions";
import {getList,normalizeGoal} from "../../../components/goalAccounts/GoalHelper";

import FarmerDashboard from "../../farmers/dashboard/Dashboard"; 
import DepositModal from "../../../components/goalAccounts/Depositmodal";
import CreateGoalWizard from "../../../components/goalAccounts/CreateGoalWizard";
import ProduceSaleForm from "../../../components/producesales/ProduceSaleForm";


const ROUTES = {
  goals: "/savings",
  transactions: "/transactions",
};


const extractGoals = (response) => {
  const data = response?.data ?? response;
  return Array.isArray(data)
    ? data
    : (data?.user_saving_goals ??
        data?.goals ??
        data?.savings_goals ??
        data?.data?.user_saving_goals ??
        data?.data?.goals ??
        []);
};

const isCompleted = (t) =>
  ["completed", "successful", "success", "paid"].includes(
    String(t.status || "").toLowerCase(),
  );

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [creating, setCreating] = useState(false);
  const [payingGoal, setPayingGoal] = useState(null);
  const [sellOpen, setSellOpen] = useState(false);

  const registeredPhone = user?.profile?.phone || user?.phone || "";

  // LOADING DASHBOARD
  const loadDashboard = useCallback(async () => {
    const [goalsResult, depositsResult] = await Promise.allSettled([
      getSavingsAccount(),
      fetchAllTransactions(getDeposits),
    ]);

   // TRANSACTIONS
    let deposits = [];
    if (depositsResult.status === "fulfilled") {
      const value = depositsResult.value;
      deposits = Array.isArray(value) ? value : getList(value, "deposits");
    } 
    else {
      console.error("failed to load transactions");
    }


    // GOALS
    if (goalsResult.status === "fulfilled") {
      const rawGoals = extractGoals(goalsResult.value);
      setGoals(
        rawGoals.map((goal) => {
          const g = normalizeGoal(goal, deposits);
          // SavingsGoalCard reads current_amount / target_amount
          return {
            ...g,
            current_amount: g.savedAmount ?? g.current_amount,
            target_amount: g.targetAmount ?? g.target_amount,
          };
        }),
      );
    } else {
      console.error("GOALS FAILED");
      toast.error("Could not load your savings goals.");
    }

    setTransactions(
      [...deposits].sort(
        (a, b) =>
          new Date(b.created_at || b.date || 0) -
          new Date(a.created_at || a.date || 0),
      ),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // SUMMARY CARDS
  const summary = useMemo(
    () => ({
      totalSavings: goals.reduce(
        (sum, g) => sum + (Number(g.savedAmount) || 0),
        0,
      ),
      totalDeposits: transactions
        .filter(isCompleted)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
      // TODO: fill from your produce-sales list endpoint once you wire it
      totalSales: 0,
    }),
    [goals, transactions],
  );


  const handleSave = () => {
    if (goals.length === 0) return setCreating(true);
    if (goals.length === 1) return setPayingGoal(goals[0]);
    navigate(ROUTES.goals);
  };

  return (
    <>
      <FarmerDashboard
        user={user}
        summary={summary}
        goals={goals}
        transactions={transactions}
        loading={loading}
        onSave={handleSave}
        onSell={() => setSellOpen(true)}
        onTransact={() => navigate(ROUTES.transactions)}
        onCreateGoal={() => setCreating(true)}
        onDeposit={setPayingGoal}
        onViewGoal={() => navigate(ROUTES.goals)}
        onViewAllGoals={() => navigate(ROUTES.goals)}
        onViewAllTransactions={() => navigate(ROUTES.transactions)}
      />

      {creating && (
        <CreateGoalWizard
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            toast.success("Savings goal created successfully.");
            loadDashboard();
          }}
        />
      )}

      {payingGoal && (
        <DepositModal
          goal={payingGoal}
          defaultPhone={registeredPhone}
          onClose={() => setPayingGoal(null)}
        />
      )}

      <ProduceSaleForm
        open={sellOpen}
        onClose={() => setSellOpen(false)}
        onSubmitted={() => {
          loadDashboard();
        }}
      />
    </>
  );
}
