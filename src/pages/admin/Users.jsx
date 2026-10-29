import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import UserTable from "../../components/users/UserTable";
import UserFilters from "../../components/users/UserFilter";
import UserStatCards from "../../components/users/UserStatCards";
import UserEmptyState from "../../components/users/UserEmptyState";
import {UserLoadingState,UserErrorState} from "../../components/users/UserPageState";
import {normalizeUser,filterUsers} from "../../components/users/filterUserUtil";
import { fetchUsers } from "../../components/users/FetchUsers";


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

  // FILTER STATE
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // FETCH ALL USERS
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const allUsers = await fetchUsers({
          isCancelled: () => cancelled,
        });

        if (cancelled || allUsers === null) return;

        const normalizedUsers = allUsers.map(normalizeUser);

        setUsers(normalizedUsers);

        // CALCULATE STATISTICS FROM ALL USERS
        setStats({
          total_users: normalizedUsers.length,
          active_users: normalizedUsers.filter(
            (user) => user.status === "active",
          ).length,
          suspended_users: normalizedUsers.filter(
            (user) => user.status === "suspended",
          ).length,
          admin_users: normalizedUsers.filter(
            (user) => user.role === "admin" || user.role === "super_admin",
          ).length,
        });
      } catch (err) {
        if (cancelled) return;

        console.error("FAILED TO FETCH USERS:", err);

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
  }, [refreshKey]);

  // FILTER ALL USERS
  const filteredUsers = useMemo(
    () => filterUsers(users, { search, role, status }),
    [users, search, role, status],
  );

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
  };

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

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
      <UserStatCards stats={stats} />

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

      {/* ALL USERS */}
      {!loading && !error && (
        <>
          <p className="text-sm text-muted">
            Showing {filteredUsers.length} of {users.length} users
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
        </>
      )}
    </section>
  );
}
