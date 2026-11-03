import { useState } from "react";
import {Eye,EyeOff,Plus,} from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";


export default function OverviewCards({ summary = {}, onAddMoney }) {
  const [showBalance, setShowBalance] = useState(true);

  const totalSavings = Number(summary.totalSavings) || 0;

  const savingsDisplay = showBalance? formatCurrency(totalSavings): "UGX.....";

  return (
    <section>
      {/* MOBILE SAVINGS CARD */}
      <article className="rounded-2xl bg-sidebar p-4 m-2 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
  
            <div>
              <p className="text-sm font-medium text-muted">Savings</p>
              
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBalance((prev) => !prev)}
            aria-label={showBalance ? "Hide balance" : "Show balance"}
            className="rounded-full p-2 text-muted transition hover:bg-bg hover:text-heading"
          >
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-3xl font-bold tracking-tight text-heading">
            {savingsDisplay}
          </h2>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onAddMoney}
            className="flex w-full items-center justify-self-start gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold text-muted transition hover:opacity-90"
          >
            <Plus size={18} />
            Open Account
          </button>
        </div>
      </article>
    </section>
  );
}
