import { useCallback, useEffect, useMemo, useState } from "react";
import {Search,RefreshCw,Wallet} from "lucide-react";
import toast from "react-hot-toast";
import { getAdminSavingGoals } from "../../api/savingsAccounts";
import { formatMoney } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";



// STATUS BADGE
function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {active ? "Open" : "Closed"}
    </span>
  );
}


// MAIN  PAGE
export default function SavingGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGoal, setSelectedGoal] = useState(null);

  // FETCH SAVINGS GOALS
 const fetchGoals = useCallback(async (isRefresh = false) => {
   try {
     if (isRefresh) setRefreshing(true); 
     const response = await getAdminSavingGoals();
     setGoals(Array.isArray(response.data?.data) ? response.data.data : []);
   } catch (error) {
     toast.error(
       error.response?.data?.message || "Failed to load savings accounts.",
     );
   } finally {
     setLoading(false);
     setRefreshing(false);
   }
 }, []);

  useEffect(()=>{
    fetchGoals();
  },[fetchGoals])


  // SEARCH AND FILTER CURRENT PAGE RECORDS
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {const farmer = goal.user || {};

      const searchText = [farmer.name, farmer.email, goal.description, goal.id].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = searchText.includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && goal.is_active === true) ||
        (statusFilter === "inactive" && goal.is_active === false);

      return matchesSearch && matchesStatus;
    });
  }, [goals, search, statusFilter]);

  

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Savings Accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor farmers' savings parterns, balances
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchGoals(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

     

      {/* SAVINGS GOALS TABLE */}
      <section className="overflow-hidden  bg-card/50">
        {/* TABLE HEADER AND FILTERS */}
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-heading">Farmers Savings Accounts</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 "
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search "
                className="w-full rounded-sm border border-border py-2.5 pl-10 pr-3 text-sm text-heading outline-none focus:border-sidebar sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-md border border-border px-2.5 py-3 text-sm text-heading outline-none focus:border-sidebar"
            >
              <option value="all">All statuses</option>
              <option value="active">Active goals</option>
              <option value="inactive">Inactive goals</option>
            </select>
          </div>
        </div>




        {/* LOADING STATE */}
        {loading ? 
        (
          <div className="space-y-4 p-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-sm bg-border/60"
              />
            ))}
          </div>
        ) 
        : filteredGoals.length === 0 ? 
        (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="rounded-full bg-bg p-4 text-muted">
              <Wallet size={28} />
            </div>

            <h3 className="mt-4 font-semibold text-heading">
              No savings accounts found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted">
              {goals.length === 0
                ? "There are no savings goals on this page."
                : "No match."}
            </p>
          </div>
        ) 
        : 
        (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-bg text-xs uppercase text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Farmer</th>
                    <th className="px-3 py-2 font-medium">Goal</th>
                    <th className="px-3 py-2 font-medium">Target Amount</th>
                    <th className="px-3 py-2 font-medium">Current Savings</th>
    
                    <th className="px-3 py-2 font-medium">Target Date</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-150">
                  {filteredGoals.map((goal) => {
                    const farmer = goal.user || {};
                    
                    return (
                      <tr
                        key={goal.id}
                        className="transition hover:bg-bg/40 hover:cursor-pointer"
                      >
                        {/* FARMER DETAILS */}
                        <td className="px-2 py-2 ">
                          <div className="flex items-center gap-1">
                            <div className="min-w-0">
                              <p className="text-heading text-xs font-semibold">
                                {farmer.name || "-"}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {farmer.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* GOAL DETAILS */}
                        <td className="px-4 py-2">
                          <p className=" font-semibold text-xs text-heading">
                            {goal.description || "No desc"}
                          </p>
                        </td>

                        {/* TARGET AMOUNT */}
                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-xs text-heading">
                          {formatMoney(goal.target_amount)}
                        </td>

                        {/* CURRENT SAVINGS */}
                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-xs text-heading">
                          {formatMoney(goal.current_amount)}
                        </td>
                        {/* TARGET DATE */}
                        <td className="whitespace-nowrap px-4 py-2 font-semibold text-xs text-heading">
                          <span>{formatDate(goal.target_date)}</span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-2">
                          <StatusBadge active={goal.is_active} />
                        </td>

                        {/* VIEW ACTION */}
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setSelectedGoal(goal)}
                            className="inline-flex items-center gap-2 rounded-md  text-sm font-medium text-heading transition hover:cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

           
          </>
        )}
      </section>




      {/* SAVINGS GOAL DETAILS MODAL */}
      {selectedGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedGoal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md border border-border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-lg font-bold text-heading"
                >
                  Account Details
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Account and farmer information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGoal(null)}
                className="rounded-md px-2 py-1 text-muted hover:bg-bg"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <DetailRow
                label="Farmer"
                value={selectedGoal.user?.name || "-"}
              />
              <DetailRow
                label="Email"
                value={selectedGoal.user?.email || "-"}
              />
              
              <DetailRow
                label="User account status"
                value={selectedGoal.user?.is_active ? "Active" : "Inactive"}
              />
              <DetailRow
                label="Goal description"
                value={selectedGoal.description || "-"}
              />
              
              <DetailRow
                label="Target amount"
                value={formatMoney(selectedGoal.target_amount)}
              />
              <DetailRow
                label="Current savings"
                value={formatMoney(selectedGoal.current_amount)}
              />
              <DetailRow
                label="Remaining amount"
                value={formatMoney(
                  Math.max(
                    Number(selectedGoal.target_amount || 0) -
                      Number(selectedGoal.current_amount || 0),
                    0,
                  ),
                )}
              />
              
              <DetailRow
                label="Goal status"
                value={selectedGoal.is_active ? "Active" : "Inactive"}
              />
              <DetailRow
                label="Target date"
                value={formatDate(selectedGoal.target_date)}
              />
              <DetailRow
                label="Created"
                value={formatDate(selectedGoal.created_at)}
              />
              <DetailRow
                label="Last updated"
                value={formatDate(selectedGoal.updated_at)}
              />
              <DetailRow label="Goal ID" value={selectedGoal.id} />
            </div>

            
          </div>
        </div>
      )}
    </div>
  );
}

// REUSABLE DETAILS ROW
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="break-all text-sm font-medium text-heading sm:max-w-[60%] sm:text-right">
        {value ?? "Not provided"}
      </span>
    </div>
  );
}
