import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { getUsers } from "../../api/users";
import { fetchPageData } from "../../utils/fetchPageData";

import UserTable from "../../components/users/UserTable";
import UserFilters from "../../components/users/UserFilter";
import UserStatCards from "../../components/users/UserStatCards";
import UserEmptyState from "../../components/users/UserEmptyState";
import { UserLoadingState, UserErrorState,} from "../../components/users/UserPageState";

import Pagination from "../../components/common/Pagnation";
import { normalizeUser, filterUsers } from "../../components/users/filterUserUtil";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    suspended_users: 0,
    admin_users: 0,
  });

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // FILTER STATE
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // FETCH  CURRENT PAGE
 useEffect(() => {
   let cancelled = false;

   async function loadUsers() {
     setLoading(true);
     setError("");

     try {
              
       const result = await fetchPageData(getUsers, currentPage);

       if (cancelled) return;

       setUsers(result.data.map(normalizeUser));
       setLastPage(result.lastPage);
       setPerPage(result.perPage);
       setTotal(result.total);

       // USE GLOBAL STATS WHEN THE API PROVIDES THEM
       if (result.stats) {
         setStats(result.stats);
       } else {
         // AT LEAST KEEP THE TOTAL USERS COUNT ACCURATE
         setStats((previous) => ({
           ...previous,
           total_users: result.total,
         }));
       }

     } catch (err) {
       if (cancelled) return;

       console.error("Failed to fetch users:", err);
       setError(err.response?.data?.message || "Failed to load users.");
     } finally {
       if (!cancelled) {
         setLoading(false);
       }
     }
   }

   loadUsers();

   return () => {
     cancelled = true;
   };
 }, [currentPage, refreshKey]);


  // FILTER THE USERS ON THE CURRENT PAGE
  const filteredUsers = useMemo(
    () => filterUsers(users, { search, role, status }),
    [users, search, role, status],
  );

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
  };

  const refresh = () => {
    setRefreshKey((key) => key + 1);
  };

  const changePage = (page) => {
    if (loading || page < 1 || page > lastPage) return;
    setCurrentPage(page);
  };

  return (
    <section className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">
            User Accounts & Moderation
          </h1>

          <p className="text-sm text-muted">
            Manage registered accounts, access roles, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border bg-sidebar px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* USER STATISTICS */}
      <UserStatCards stats={stats}  />

      {/* FILTERS */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* LOADING STATE */}
      {loading && <UserLoadingState />}

      {/* ERROR STATE */}
      {!loading && error && (
        <UserErrorState message={error} onRetry={refresh} />
      )}

      {/* USER TABLE */}
      {!loading && !error && (
        <>
          <p className="text-sm text-muted">
           {filteredUsers.length} of {users.length}{" "}
            {total}
          </p>

          {filteredUsers.length > 0 ? (
            <UserTable
              users={filteredUsers}
              setUsers={setUsers}
              currentUserRole="admin"
            />
          ) : (
            <UserEmptyState onReset={resetFilters} />
          )}

          {/* SERVER-SIDE PAGINATION */}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={total}
            perPage={perPage}
            loading={loading}
            onPageChange={changePage}
          />
        </>
      )}
    </section>
  );
}
