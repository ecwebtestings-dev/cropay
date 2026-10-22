import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getDeposits } from "../../../api/deposits";
import { formatCurrency } from "../../../utils/formatCurrency";
import SummaryCard from "../../../components/common/SummaryCard";
import DepositFilters from "./DepositFilters";
import DepositRow from "./DepositRow";
import { EmptyState, ErrorState, LoadingState } from "./Tablestates";
import {extractRecords, isActive, isVoided, isWithinDate, sumAmounts,} from "../../../utils/DepositUtils";

export default function Transactions() {
  const [deposits, setDeposits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getDeposits();
      setDeposits(extractRecords(response.data));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to load deposits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeposits(); }, [fetchDeposits]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deposits.filter((d) => {
      const okStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && isActive(d)) ||
        (statusFilter === "Voided" && isVoided(d));
      const okSearch =
        !q ||
        String(d.id || "").toLowerCase().includes(q) ||
        String(d.reference || "").toLowerCase().includes(q);
      return okStatus && okSearch && isWithinDate(d.created_at, dateFilter);
    });
  }, [deposits, statusFilter, dateFilter, search]);


  const stats = useMemo(() => {
    const active = deposits.filter(isActive);
    const total = sumAmounts(active);
    return { count: active.length, total, voided: deposits.filter(isVoided).length, net: total };
  }, [deposits]);

  return (
    <div className="min-h-full space-y-8 border border-border bg-[#F3F5F3] p-4 lg:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="mt-2 text-base text-slate-500">View and manage your deposits</p>
        </div>

        <button
          type="button"
          onClick={fetchDeposits}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Successful Deposits" value={stats.count} />
        <SummaryCard label="Total Deposited" value={formatCurrency(stats.total)} />
        <SummaryCard label="Voided Deposits" value={stats.voided} />
        <SummaryCard label="Net Deposits" value={formatCurrency(stats.net)} featured />
      </section>

      <DepositFilters
        status={statusFilter} onStatus={setStatusFilter}
        date={dateFilter} onDate={setDateFilter}
        search={search} onSearch={setSearch}
      />

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
        {loading ? (<LoadingState />
        ) : error ? (<ErrorState message={error} onRetry={fetchDeposits} />
        ) : filtered.length === 0 ? (<EmptyState />
        ) : 
        (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Deposit history</h2>
              <span className="text-sm text-slate-500">{filtered.length} records</span>
            </div>
            <div className="divide-y divide-slate-100">
              {filtered.map((d) => <DepositRow key={d.id} deposit={d} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}