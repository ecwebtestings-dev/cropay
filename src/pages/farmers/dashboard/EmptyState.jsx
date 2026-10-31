import { Target, Plus } from "lucide-react";

export default function EmptySavingsState({ onCreateGoal }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Target size={27} />
      </div>

      <h3 className="mt-4 font-semibold text-heading">No savings goals yet</h3>

      <p className="mt-1 max-w-xs text-sm leading-6 text-muted">
        Create your first savings goal and start building towards something
        important.
      </p>

      <button
        type="button"
        onClick={onCreateGoal}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-heading px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Plus size={17} />
        Create a goal
      </button>
    </div>
  );
}
