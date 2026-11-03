import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {PiggyBank} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getDeposits } from "../../../api/deposits";
import { getSavingsAccount } from "../../../api/savingsAccounts";
import SavingsGoalCard from "./SavingsGoalCard";
import CreateGoalWizard from "../../../components/goalAccounts/CreateGoalWizard";
import DepositModal from "../../../components/goalAccounts/Depositmodal";
import {getList,normalizeGoal,} from "../../../components/goalAccounts/GoalHelper";



export default function SavingsGoals() {
  const { user } = useAuth();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [payingGoal, setPayingGoal] = useState(null);

  const registeredPhone = user?.profile?.phone || user?.phone || "";

  // LOAD SAVINGS GOALS AND DEPOSITS.
  const loadGoals = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");

      const [goalsResponse, depositsResponse] = await Promise.all([
        getSavingsAccount(),
        getDeposits().catch((err) => {
          console.error("DEPOSITS REQUEST FAILED:", err);
          return null;
        }),
      ]);

      const responseData = goalsResponse?.data ?? goalsResponse;

      const rawGoals = Array.isArray(responseData)
        ? responseData
        : (responseData?.user_saving_goals ??
          responseData?.goals ??
          responseData?.savings_goals ??
          responseData?.data?.user_saving_goals ??
          responseData?.data?.goals ??
          []);

      if (!Array.isArray(rawGoals)) {
        throw new Error("The savings goals response is not a valid list.");
      }

      const deposits = depositsResponse
        ? getList(depositsResponse, "deposits")
        : [];

      const normalizedGoals = rawGoals.map((goal) => {
        const normalized = normalizeGoal(goal, deposits);

        return {
          ...normalized,
          current_amount:
            normalized.savedAmount ?? normalized.current_amount ?? 0,
          target_amount:
            normalized.targetAmount ?? normalized.target_amount ?? 0,
        };
      });

      setGoals(normalizedGoals);
    } catch (err) 
    {
      setError(
        err.response?.data?.message || err.message || "Could not load your savings goals.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("OrderTrackingId")) {
      toast.success(
        "Thanks! We're confirming your payment. Your progress will update shortly.",
      );

      window.history.replaceState({}, "", window.location.pathname);
    }

    loadGoals();
  }, [loadGoals]);







  // HANDLE SUCCESSFUL GOAL CREATION.
  const handleCreated = () => {
    setCreating(false);
    toast.success("Savings goal account created successfully.");
    loadGoals({ silent: true });
  };



  // HANDLE PAYMENT INITIALIZATION.
  const handlePaymentStarted = () => {
    setPayingGoal(null);
    loadGoals({ silent: true });
  };




  return (
    <div className="min-h-full space-y-5">
      
      {/* GOALS SECTION HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-heading">
            Your Savings Accounts
          </h2>

          <p className="mt-1 text-sm text-muted">
            Keep track of what you are saving for
          </p>
        </div>

      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse space-y-5 rounded-2xl border border-border bg-card p-6"
            >
              <div className="h-10 w-10 rounded-sm bg-bg" />
              <div className="h-5 w-36 rounded bg-bg" />
              <div className="h-3 w-full rounded bg-bg" />
              <div className="h-10 w-full rounded-sm bg-bg" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-card p-10 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => loadGoals()}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && goals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <PiggyBank size={30} />
          </span>

          <h3 className="mt-5 text-lg font-bold text-heading">
            Start your savings journey
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Open up your first savings Accounts and start putting money aside
            towards something meaningful
          </p>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-6 inline-flex items-center rounded-sm bg-sidebar px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open Account
          </button>
        </div>
      )}

      {/* SAVINGS GOAL CARDS */}
      {!loading && !error && goals.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              user={user}
              onDeposit={setPayingGoal}
            />
          ))}
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      {creating && (
        <CreateGoalWizard
          onClose={() => setCreating(false)}
          onCreated={handleCreated}
        />
      )}

      {/* MAKE DEPOSIT MODAL */}
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
