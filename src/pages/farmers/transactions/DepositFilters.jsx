
import { CalendarDays, Search } from "lucide-react";
import { DATE_FILTERS, FILTERS } from "../../../utils/DepositUtils";

export default function DepositFilters({status,onStatus,date, onDate,search,onSearch,}) {
  return (
    <>
      {/* Transaction Status Filters */}
      <section className="flex flex-wrap gap-2 rounded-md bg-white p-2">
        {FILTERS.map((filterStatus) => (
          <button
            key={filterStatus}
            type="button"
            role="tab"
            aria-selected={status === filterStatus}
            onClick={() => onStatus(filterStatus)}
            className={`rounded-md px-5 py-3 text-sm font-semibold transition ${
              status === filterStatus
                ? "bg-[#12372B] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {filterStatus}
          </button>
        ))}
      </section>

      {/* Date Filter and Transaction Search */}
      <section className="flex flex-col gap-3 sm:flex-row">
        
        {/* Date Filter */}
        <label className="relative w-full sm:w-48">
          <CalendarDays size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={date}
            onChange={(event) => onDate(event.target.value)}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-700"
          >
            {DATE_FILTERS.map((dateFilterOption) => (
              <option
                key={dateFilterOption.value}
                value={dateFilterOption.value}
              >
                {dateFilterOption.label}
              </option>
            ))}
          </select>
        </label>

        {/* Search by Transaction ID */}
        <label className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search ID or reference..."
            className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-700"
          />
        </label>
      </section>
    </>
  );
}
