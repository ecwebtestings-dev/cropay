import { Search, FilterX, Filter } from "lucide-react";

export default function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  onReset,
}) {
  // SHARED LABEL STYLES.
  const fieldLabel = "mb-1.5 block text-sm font-semibold text-heading";

  // SHARED INPUT AND SELECT STYLES.
  const fieldStyle =
    "w-full min-w-0 rounded-sm border border-border bg-card px-3 py-2.5 text-sm text-body outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent";

  return (
    <section className="mb-5 rounded-sm border border-border bg-card p-4">
      {/* FILTER HEADER */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={17} className="text-muted" />

          <h2 className="text-sm font-semibold text-heading">Filter users</h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-bg hover:text-heading"
        >
          <FilterX size={15} />
          Clear filters
        </button>
      </div>

      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* SEARCH USERS */}
        <div className="min-w-0 xl:col-span-2">
          <label htmlFor="user-search" className={fieldLabel}>
            Search users
          </label>

          <div className="relative">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, email, or phone"
              className={`${fieldStyle} pl-9`}
            />
          </div>
        </div>

        {/* ROLE FILTER */}
        <div className="min-w-0">
          <label htmlFor="user-role" className={fieldLabel}>
            User role
          </label>

          <select
            id="user-role"
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            className={fieldStyle}
          >
            <option value="all">All roles</option>
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {/* ACCOUNT STATUS FILTER */}
        <div className="min-w-0">
          <label htmlFor="user-status" className={fieldLabel}>
            Account status
          </label>

          <select
            id="user-status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className={fieldStyle}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
    </section>
  );
}
