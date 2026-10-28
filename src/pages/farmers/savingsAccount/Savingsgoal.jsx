import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PiggyBank, Plus, Wallet } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { getDeposits } from "../../../api/deposits";
import { getSavingsAccount } from "../../../api/savingsAccounts";
import GoalCard from "../../../components/goalAccounts/Goalcard";
import CreateGoalWizard from "../../../components/goalAccounts/CreateGoalWizard";
import DepositModal from "../../../components/goalAccounts/Depositmodal";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getList, normalizeGoal } from "../../../components/goalAccounts/GoalHelper";

export default function SavingsGoals() {
  const { user } = useAuth();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false); 
  const [payingGoal, setPayingGoal] = useState(null); 

  // The number the user registered with. Adjust to where your user object keeps it.
  const registeredPhone = user?.profile?.phone || user?.phone ||"";

  // silent = refresh without showing the loading placeholders again
  const loadGoals = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");

      // Two requests. Deposits are used to work out progress if the goal doesn't carry its own total.
      const [goalsResponse, depositsResponse] = await Promise.all([
        getSavingsAccount(),
        getDeposits().catch(() => null), // progress still shows if this one fails
      ]);

      const deposits = depositsResponse
        ? getList(depositsResponse, "deposits")
        : [];
      setGoals(
        getList(goalsResponse, "goals", "savings_goals").map((goal) =>
          normalizeGoal(goal, deposits),
        ),
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your savings goals.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Pesapal sends people back here after paying, with ?OrderTrackingId=... in the address.
    const params = new URLSearchParams(window.location.search);
    if (params.get("OrderTrackingId")) {
      toast.success(
        "Thanks! We're confirming your payment. Your progress will update shortly.",
      );
      window.history.replaceState({}, "", window.location.pathname);
    }

    loadGoals();
  }, [loadGoals]);

  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + goal.savedAmount, 0),[goals],);

  const handleCreated = () => {
    setCreating(false);
    toast.success("Savings goal account created sucessfully");
    loadGoals({ silent: true });
  };

  const handlePaymentStarted = () => {
    setPayingGoal(null);
    loadGoals({ silent: true });
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mt-1 text-sm text-muted">
            <strong>Open a savings account</strong> <br />
            Grow your wealth and reach your money goals by creating a savings account
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-md bg-sidebar px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={15} /> Create Goal
          </button>
        </div>
      </div>

      {/* Total savings */}
      {!loading && goals.length > 0 && (
        <div className="flex items-center gap-4 rounded-md border border-border bg-card p-5 sm:max-w-sm">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-bg text-sidebar">
            <Wallet size={15} />
          </span>
          <div>
            <p className="text-sm text-muted">Total savings</p>
            <p className="text-2xl font-bold text-heading">
              {formatCurrency(totalSaved)}
            </p>
          </div>
        </div>
      )}

      {/* Loading placeholders */}
      {loading && (
        <div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-md border border-border bg-card p-5"
            >
              <div className="h-8 w-40 animate-pulse rounded bg-bg" />
              <div className="h-2.5 animate-pulse rounded-full bg-bg" />
              <div className="h-10 animate-pulse rounded-lg bg-bg" />
            </div>
          ))}
        </div>
      )}

      {/* Could not load */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-md border border-border bg-card p-10 text-center"
        >
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => loadGoals()}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-bg"
          >
            Reload
          </button>
        </div>
      )}

      {/* No goals yet */}
      {!loading && !error && goals.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-bg text-primary">
            <PiggyBank size={28} />
          </span>
          <h2 className="mt-4 font-semibold text-heading">
            You have no savings goals yet
          </h2>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Create your first goal and start saving towards it.
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={18} /> Create Goal
          </button>
        </div>
      )}

      {/* Goal cards */}
      {!loading && !error && goals.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onAddMoney={setPayingGoal} />
          ))}
        </div>
      )}

      {/* */}
      {creating && (
        <CreateGoalWizard
          onClose={() => setCreating(false)}
          onCreated={handleCreated}
        />
      )}

      {payingGoal && (
        <DepositModal
          goal={payingGoal}
          defaultPhone={registeredPhone}
          onClose={() => setPayingGoal(null)}
          onStarted={handlePaymentStarted}
        />
      )}
    </div>
  );
}
