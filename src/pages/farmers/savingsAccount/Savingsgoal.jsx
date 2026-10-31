import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {PiggyBank,Wallet} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getDeposits } from "../../../api/deposits";
import { getSavingsAccount } from "../../../api/savingsAccounts";
import GoalCard from "../../../components/goalAccounts/Goalcard";
import CreateGoalWizard from "../../../components/goalAccounts/CreateGoalWizard";
import DepositModal from "../../../components/goalAccounts/Depositmodal";
import { formatCurrency } from "../../../utils/formatCurrency";
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

      const normalizedGoals = rawGoals.map((goal) =>
        normalizeGoal(goal, deposits),
      );

      setGoals(normalizedGoals);
    } catch (err) {
      console.error("SAVINGS GOALS LOADING ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not load your savings goals.",
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




  // CALCULATE SAVINGS OVERVIEW.
  const overview = useMemo(() => {
    const totalSaved = goals.reduce(
      (sum, goal) => sum + (Number(goal.savedAmount) || 0),
      0,
    );

    const totalTarget = goals.reduce(
      (sum, goal) => sum + (Number(goal.targetAmount) || 0),
      0,
    );

    const activeGoals = goals.filter((goal) => goal.isActive !== false).length;

    const overallProgress =
      totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

    return {
      totalSaved,
      totalTarget,
      activeGoals,
      totalGoals: goals.length,
      overallProgress,
    };
  }, [goals]);




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
    <div className="min-h-full space-y-7 text-foreground">
  
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-sidebar">
              MY SAVINGS
            </span>
          </div>


          <p className="mt-1 text-sm text-muted">
            Manage your savings, track progress and achieve your financial
            goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
        
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-sm bg-sidebar px-3 py-2 text-sm text-white shadow-sm transition hover:opacity-90"
          >
            Create goal
          </button>
        </div>
      </div>



      {/* SAVINGS SUMMARY */}
      {!loading && !error && (
        <div className="grid gap-5 lg:grid-cols-5">
         
          {/* BALANCE CARD */}
          <div className="relative overflow-hidden rounded-lg bg-sidebar p-4 text-white lg:col-span-3 sm:p-8">
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Wallet size={17} />
                  Total savings
                </div>

                <span className="rounded-sm bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  CropPay
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
                {formatCurrency(overview.totalSaved)}
              </h2>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs text-white/70">
                  <span>{overview.overallProgress.toFixed(1)}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-[#72C69A] transition-all duration-700"
                    style={{
                      width: `${overview.overallProgress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-white/60">
                  Target: {formatCurrency(overview.totalTarget)}
                </p>
              </div>
            </div>
          </div>


          
        </div>
      )}



      {/* GOALS SECTION HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-heading">Your Savings Accounts</h2>

          <p className="mt-1 text-sm text-muted">
            Keep track of what you are saving for
          </p>
        </div>

        {!loading && goals.length > 0 && (
          <span className="text-xs font-medium text-muted">
            {goals.length} {goals.length === 1 ? "goal" : "goals"}
          </span>
        )}
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
            Open up your first savings Accounts and start putting money aside towards
            something meaningful
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
            <GoalCard key={goal.id} goal={goal} onAddMoney={setPayingGoal} />
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
