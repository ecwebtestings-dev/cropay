import { ArrowLeftRight, Plus, ShoppingBasket } from "lucide-react";

const ACTIONS = [
  {
    id: "save",
    label: "Save",
    description: "Add money to a goal",
    icon: Plus,
    
  },
  {
    id: "sell",
    label: "Sell",
    description: "Sell Product",
    icon: ShoppingBasket,
    
  },
  {
    id: "Open",
    label: "Transact",
    description: "View your activity",
    icon: ArrowLeftRight,
    
  },
];

export default function PrimaryActions({ onSave, onSell, onTransact }) {
  
  
  const handlers = {
    save: onSave,
    sell: onSell,
    transact: onTransact,
  };


return (
  <section>
    <div className="mb-3 mx-auto flex items-center flex-col justify-center">

      <p className="mt-1 text-sm text-muted">
        What would you like to do today?
      </p>
    </div>

    <div className="grid grid-cols-3 items-center justify-center gap-2 sm:gap-3 md:mx-auto md:max-w-[650px]">
      {ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.id}
            type="button"
            onClick={handlers[action.id]}
            className="group flex min-w-0 flex-col items-center gap-2 rounded-md border border-border bg-sidebar p-2 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm sm:flex-row sm:justify-center sm:gap-3 sm:p-4 sm:text-left"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-white">
              <Icon size={21} />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                {action.label}
              </span>

              <span className="mt-0.5 hidden text-xs text-white sm:block">
                {action.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </section>
);
}
