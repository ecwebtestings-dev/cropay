import { Loader2, Wallet } from "lucide-react";

export const LoadingState = ({ text = "Loading" }) => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-slate-500">
    <Loader2 size={16} className="animate-spin" />
    <p>{text}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-6 text-center">
    <p className="font-medium text-red-700">{message}</p>
    <button type="button" onClick={onRetry} className="rounded-xl bg-[#12372B] px-5 py-3 text-sm font-semibold text-white">
      Try again
    </button>
  </div>
);

export const EmptyState = ({
  title = "No transactions found",
  text = "Try adjusting your filters or search for another deposit.",
}) => (
  <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-5 flex h-10 w-10 items-center justify-center  ">
      <Wallet size={15} strokeWidth={1.5} />
    </div>
    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{text}</p>
  </div>
);