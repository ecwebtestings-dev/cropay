
import {ChevronLeft,ChevronRight,MoreHorizontal,} from "lucide-react";


export default function Pagination({currentPage = 1,lastPage = 1,total = 0,perPage = 10,onPageChange,loading = false,}) {
  
    // DO NOT RENDER PAGINATION WHEN THERE IS ONLY ONE PAGE.
  if (lastPage <= 1) return null;

  // CREATE A SMALL RANGE OF PAGE NUMBERS AROUND THE CURRENT PAGE.
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(lastPage, currentPage + 2);

    if (start > 1) {
      pages.push(1);

      if (start > 2) {
        pages.push("start-ellipsis");
      }
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < lastPage) {
      if (end < lastPage - 1) {
        pages.push("end-ellipsis");
      }

      pages.push(lastPage);
    }

    return pages;
  };

  // CALCULATE THE RANGE OF RECORDS DISPLAYED ON THIS PAGE.
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const buttonClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* SHOW THE CURRENT RECORD RANGE. */}
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-foreground">{from}</span>
        {" "}to{" "}
        <span className="font-medium text-foreground">{to}</span>
        {" "}of{" "}
        <span className="font-medium text-foreground">{total}</span>
        {" "}users
      </p>

      {/* PAGE NAVIGATION CONTROLS. */}
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1"
      >
        {/* GO TO THE PREVIOUS PAGE. */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={buttonClass}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* RENDER PAGE NUMBERS AND ELLIPSES. */}
        {getPageNumbers().map((page) => {
          if (typeof page !== "number") {
            return (
              <span
                key={page}
                className="inline-flex h-9 w-8 items-center justify-center text-muted"
                aria-hidden="true"
              >
                <MoreHorizontal size={18} />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={loading}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
              className={`${buttonClass} ${
                isActive
                  ? "border-sidebar bg-sidebar text-white"
                  : "bg-card text-foreground hover:bg-bg"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* GO TO THE NEXT PAGE. */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage || loading}
          className={buttonClass}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
