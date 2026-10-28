import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  loading = false,
  total = 0,
  perPage = 10,
}) {
  const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-col gap-3 border-t border-dusty-olive-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-carbon-black-600">
        Showing{" "}
        <span className="font-medium text-carbon-black-900">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-carbon-black-900">{total}</span>{" "}
        results
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="inline-flex items-center gap-1 rounded-lg border border-dusty-olive-300 px-3 py-2 text-sm text-carbon-black-800 transition hover:bg-dusty-olive-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="whitespace-nowrap text-sm text-carbon-black-700">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{lastPage}</span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || loading}
          className="inline-flex items-center gap-1 rounded-lg border border-dusty-olive-300 px-3 py-2 text-sm text-carbon-black-800 transition hover:bg-dusty-olive-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
