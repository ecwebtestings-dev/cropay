
import { Search, FilterX, FilterIcon } from "lucide-react";

export default function UserFilters({search,onSearchChange,role,onRoleChange,status,onStatusChange,onReset,}) {
  
    const fieldLabel ="mb-2 block text-sm text-muted ";
   const fieldStyle ="w-full min-w-0 rounded-md border border-border bg-white px-3 py-2.5 text-sm text-heading outline-none transition focus:border-sidebar focus:ring-2 focus:ring-sidebar/20 ";

  return (
    <div className="mb-5 rounded-xl border border-border bg-white p-4 shadow-smsm:p-5">
      
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-base flex items-center font-semibold text-heading">
         <FilterIcon size={18} className="text-muted"/> Filter Users
        </h2>
        
      </div>

      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* SEARCH */}
        <div className="min-w-0 xl:col-span-2">
          <label className={fieldLabel} htmlFor="user-search">
            Search Users
          </label>

          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, email, or phone"
              className={`${fieldStyle} pl-10`}
            />
          </div>
        </div>

        {/* ROLE FILTER */}
        <div className="min-w-0">
          <label className={fieldLabel} htmlFor="user-role">
            Filter by Role
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
          <label className={fieldLabel} htmlFor="user-status">
            Account Status
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

      {/* CLEAR FILTERS */}
      <div className="mt-5 flex justify-end border-t border-border pt-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-sidebar text-white hover:cursor-pointer"
        >
          <FilterX size={16} />
          Clear filters
        </button>
      </div>
    </div>
  );
}
