import { ArrowDownToLine } from "lucide-react";
import StatusBadge from "../../../components/common/StatusBadge";
import { formatCurrency } from "../../../utils/formatCurrency";   
import { formatDate } from "../../../utils/formatDate";
import { PAYMENT_METHODS } from "../../../utils/constraints";

const methodLabel = (value) => PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;

export default function DepositRow({ deposit }) {
  return (
    <article className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
          <ArrowDownToLine size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">Deposit #{String(deposit.id).slice(-8)}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{deposit.reference || "No reference"}</p>
          <p className="mt-1 text-xs text-slate-400">
            {formatDate(deposit.created_at) || "Date unavailable"}
            {deposit.payment_method ? ` · ${methodLabel(deposit.payment_method)}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="font-bold text-slate-900">{formatCurrency(deposit.amount)}</span>
        <StatusBadge status={deposit.status} />
      </div>
    </article>
  );
}