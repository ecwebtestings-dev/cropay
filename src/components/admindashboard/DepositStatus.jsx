import { Clock } from "lucide-react";

import {formatMoney,formatNumber} from "../../utils/formatCurrency";

import { SectionHeading } from "./Overviewstats";

export default function DepositStatus({ deposits = {} }) {
  
    const depositStatuses = deposits.breakdown_by_status ?? [];
    const totalStatusRecords = depositStatuses.reduce((sum, item) => sum + Number(item.count || 0),0,);
    const hasPendingDeposits = depositStatuses.some((item) => String(item.status).toLowerCase() === "pending",);

  return (
    <section className="rounded-sm border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <SectionHeading
          title="Deposit Status Breakdown"
          subtitle="Understand how deposit records are progressing"
        />

        <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {formatNumber(totalStatusRecords)} records
        </span>
      </div>

      {depositStatuses.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No deposit status information available.
        </p>
      ) 
      : 
      (
        <div className="mt-6 space-y-5">
          {depositStatuses.map((item) => {
            const count = Number(item.count || 0);
            const percentage = totalStatusRecords > 0 ? (count / totalStatusRecords) * 100 : 0;
            const status = String(item.status || "unknown").toLowerCase();
            const color = "bg-gray-400";

            return (
              <div key={status}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

                    <span className="text-sm font-medium capitalize text-heading">
                      {status}
                    </span>

                    <span className="text-xs text-muted">
                      ({formatNumber(count)})
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-heading">
                    {formatMoney(item.total_amount)}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-bg">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasPendingDeposits && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Clock className="mt-0.5 shrink-0 text-amber-700" size={20} />

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Pending deposits require attention
            </p>

            <p className="mt-1 text-sm text-amber-800">
              Review pending records before treating their amounts as completed
              deposits.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
