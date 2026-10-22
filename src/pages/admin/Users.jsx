
import { useEffect, useMemo, useState } from "react";
import { Loader2, Users as UsersIcon, RefreshCw, User2, UserCheck, UserX, ShieldCheck, } from "lucide-react";

import { getUsers } from "../../api/users";
import UserTable from "../../components/users/UserTable";
import UserFilters from "../../components/users/UserFilter";


function UserStatCards({users}){
    const stats =[
        {
            label:"Users",
            value: users.length,
            description: "User Accounts",
            Icon:User2,
        },
        {
            label:"Active Accounts",
            value: users.filter((user)=>user.status==="active").length,
            description: "Active users",
            Icon:UserCheck,
        },
        {
            label:"Suspended Users",
            value: users.filter((user)=>user.status === 'suspended').length,
            description: "Restricted Accounts",
            Icon:UserX,
        },
        {
            label:"Staff & Admins",
            value: users.filter((user)=>['admin','superadmin'].includes(user.role)).length,
            description: "Privileged Accounts",
            Icon:ShieldCheck,
        },
    ]

    return(
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-5">
            {stats.map(({label,value,description,Icon})=>(
                <div className="rounded-md border border-border bg-card p-4 hover:border-slate-300"
                    key={label}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium text-muted uppercase">{label}</p>
                            <p className="mt-2 text-2xl font-bold text-heading">{value}</p>
                        </div>

                        <div>
                            <Icon size={20} className="text-muted"/>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-muted">{description}</p>
                </div>
            ))}
            
        </div>
    )
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  // Fetch users 
  useEffect(() => {
    let cancelled = false;

    
async function fetchUsers() {
  setLoading(true);
  setError("");

          try {
            const response = await getUsers({ page: 1 });
            const result = response.data;
            const userList = result?.data?.data;


            if (!Array.isArray(userList)) {
              throw new Error(" users list was not found.");
            }
            
            //ARRAY OF USERS
            const normalizedUsers = userList.map((user) => {
              const isActive =user.is_active === true || user.is_active === 1 ||
                String(user.is_active).toLowerCase() === "true";

              return {...user,status: isActive ? "active" : "suspended",
                phone: user.profile?.phone ?? user.phone ?? "",
              };
            });

            if (!cancelled) {
              setUsers(normalizedUsers);
            }
          } catch (err) {
            if (!cancelled) {
              console.error("Failed to fetch users:", err);

              setError(
                err.response?.data?.message ||
                  err.message ||
                  "Failed to load users. Please try again."
              );
            }
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        }


    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Filter the users without modifying the original list
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
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesRole = role === "all" || user.role === role;

      const matchesStatus =status === "all" || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const resetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
  };

  return (
    <section className="space-y-6">
      {/* HEADINGS*/}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">
            User Accounts & Moderation
          </h1>
          <p className="text-muted text-sm"> Registered accounts , access roles, account standing, and profile inspection.</p>
          
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border  px-3 py-2 text-sm cursor-pointer text-white bg-sidebar disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/*STATISTICS CARDS */}
      <UserStatCards users={filteredUsers}/>

      {/* SEARCH AND FILTERS */}
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted">
          <Loader2 className="animate-spin" size={20} />
          Loading users...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="mt-3 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filtered table */}
      {!loading && !error && (
        <UserTable
          users={filteredUsers}
          setUsers={setUsers}
          currentUserRole="admin"
        />
      )}
    </section>
  );
}
