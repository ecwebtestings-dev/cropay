import { ArrowLeftRight, HandCoins, ShoppingBasket } from "lucide-react";

const ACTIONS = [
  {
    id: "save",
    label: "Save",
    description: "Add money to savings",
    icon: HandCoins,
  },
  {
    id: "sell",
    label: "Sell",
    description: "Sell your produce",
    icon: ShoppingBasket,
  },
  {
    id: "transact",
    label: "Transact",
    description: "View your transactions",
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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 md:max-w-2xl items-start">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={handlers[action.id]}
              className="
                group flex min-w-0 flex-col items-center justify-center
                gap-2 rounded-xl md:rounded-sm border border-border bg-sidebar
                px-2 py-2 text-center text-white
                transition duration-200
                hover:shadow-md
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-primary focus-visible:ring-offset-2
                sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:py-4
                sm:text-left
              "
            >
              <span
                className="
                grid h-10 w-10 shrink-0 place-items-center
                rounded-full bg-white/10 text-white
                transition group-hover:bg-white/20
                sm:h-11 sm:w-11
              "
              >
                <Icon size={21} strokeWidth={2} />
              </span>

              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold sm:text-sm">
                  {action.label}
                </span>

                <span className="mt-1 hidden text-xs leading-4 text-white/65 sm:block">
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
