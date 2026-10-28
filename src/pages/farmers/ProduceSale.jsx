import { useState } from "react";
import { Plus, ShoppingBasket } from "lucide-react";
import ProduceSaleForm from "../../components/producesales/ProduceSaleForm";

export default function SellProduceButton() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg">
            <ShoppingBasket className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold text-heading">
              Ready to sell your produce?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Submit your produce details to start a sale request.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sidebar px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Sell Produce
        </button>
      </div>

      <ProduceSaleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmitted={() => setFormOpen(false)}
      />
    </>
  );
}
