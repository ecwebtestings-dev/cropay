import { Loader2 } from "lucide-react";

export function UserLoadingState() {
  return (
    <div
      className="flex items-center justify-center gap-2 py-12 text-muted"
      role="status"
    >
      <Loader2 className="animate-spin" size={20} />
      <span>Loading</span>
    </div>
  );
}

export function UserErrorState({ message, onRetry }) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
      role="alert"
    >
      <p>{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-3 font-medium underline"
      >
        Try again
      </button>
    </div>
  );
}
