
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  RefreshCw,
  User2,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

import { fetchAllUsers } from "../../components/users/FetchUsers";
import UserTable from "../../components/users/UserTable";
import UserFilters from "../../components/users/UserFilter";

function UserStatCards({ users }) {
  const stats = [
    {
      label: "Users",
      value: users.length,
      description: "User Accounts",
      Icon: User2,
    },
    {
      label: "Active Accounts",
      value: users.filter((u) => u.status === "active").length,
      description: "Active users",
      Icon: UserCheck,
    },
    {
      label: "Suspended Users",
      value: users.filter((u) => u.status === "suspended").length,
      description: "Restricted Accounts",
      Icon: UserX,
    },
    {
      label: "Staff & Admins",
      value: users.filter((u) =>
        ["admin", "super_admin", "superadmin"].includes(u.role),
      ).length,
      description: "Privileged Accounts",
      Icon: ShieldCheck,
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, description, Icon }) => (
        <div
          key={label}
          className="rounded-md border border-border bg-card p-4 hover:border-slate-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-heading">{value}</p>
            </div>
            <Icon size={20} className="text-muted" />
          </div>
          <p className="mt-3 text-sm text-muted">{description}</p>
        </div>
      ))}
    </div>
  );
}

// CONVERT API USERS INTO THE FORMAT EXPECTED BY THE TABLE AND FILTERS.
const normalizeUser = (user) => {
  const isActive =
    user.is_active === true ||
    user.is_active === 1 ||
    String(user.is_active).toLowerCase() === "true";

  return {
    ...user,
    status: isActive ? "active" : "suspended",
    phone: user.profile?.phone ?? user.phone ?? "",
  };
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // FETCH USERS PAGE BY PAGE, WITH RETRIES IF THE SERVER IS BUSY.
        const allUsers = await fetchAllUsers({
          isCancelled: () => cancelled,
          onProgress: (page, lastPage) => {
            if (!cancelled) {
              console.log(`Fetching page ${page} of ${lastPage}`);
            }
          },
        });

        if (allUsers && !cancelled) {
          setUsers(allUsers.map(normalizeUser));
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch users:", err);

        setError(
          err.response?.status === 429
            ? "The server is busy right now. Please wait a minute and try again."
            : err.response?.data?.message ||
                err.message ||
                "Failed to load users. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      // STOP THE FETCH PROCESS WHEN THE PAGE UNMOUNTS OR REFRESHES.
      cancelled = true;
    };
  }, [refreshKey]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.name,
          user.username,
          user.email,
          user.phone,
          user.phone_number,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
  };

  const refresh = () => setRefreshKey((key) => key + 1);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">
            User Accounts & Moderation
          </h1>
          <p className="text-sm text-muted">
            Registered accounts, access roles, account standing, and profile
            inspection.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm text-white bg-sidebar disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <UserStatCards users={users} />

      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p>{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-3 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

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
            <div className="rounded-md border border-border bg-card py-12 text-center">
              <p className="font-medium text-foreground">No users found</p>
              <p className="mt-1 text-sm text-muted">
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-medium text-foreground underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
