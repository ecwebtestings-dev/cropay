const STYLES = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

const FALLBACK = "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300";


export default function StatusBadge({ status = "" }) {
  const key = status.toLowerCase();

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        STYLES[key] ?? FALLBACK
      }`}
    >
      {status}
    </span>
  );
}