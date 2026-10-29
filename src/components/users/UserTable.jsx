
import { FileUser } from "lucide-react";
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";
import {suspendUser,unsuspendUser,promoteUserToAdmin,demoteAdmin} from "../../api/users";

export default function UserTable({users: usersProp,currentUserRole,setUsers,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
    const users = Array.isArray(usersProp) ? usersProp : [];

  // Update a user in the table and selected profile
  const updateUserState = (userId, changes) => {
    setUsers((previousUsers) => {
      const safeUsers = Array.isArray(previousUsers)
        ? previousUsers
        : [];

      return safeUsers.map((user) =>
        user.id === userId
          ? { ...user, ...changes }
          : user
      );
    });

    setSelectedUser((previousUser) =>
      previousUser?.id === userId
        ? { ...previousUser, ...changes }
        : previousUser
    );
  };

  // Suspend or reactivate a user
 const handleChangeStatus = async (userId, status) => {

  try {
    if (status === "suspended") {
      await suspendUser(userId);
    } else if (status === "active") {
      await unsuspendUser(userId);
    } else {
      throw new Error("Invalid account status.");
    }

    updateUserState(userId, {
      status,
      is_active: status === "active",
    });
  } catch (error) {
    console.error("Failed to change user status:", error);


    throw error;
  }
};

  // Promote a farmer to admin or demote an admin to farmer
      const handleChangeRole = async (userId, role) => {
      

      try {
        if (role === "admin") {
          await promoteUserToAdmin(userId);
        } else if (role === "farmer") {
          await demoteAdmin(userId);
        } else {
          throw new Error("Unsupported role.");
        }

        updateUserState(userId, { role });
      } catch (error) {
        console.error("Failed to change user role:", error);

        throw error;
      }
    };
  

  return (
    <>
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border bg-card">
            <tr className="text-sm font-semibold uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-2">
                User
              </th>
              <th scope="col" className="px-4 py-2">
                Phone
              </th>
              <th scope="col" className="px-4 py-2">
                Status
              </th>
              <th scope="col" className="px-4 py-2">
                Role
              </th>
              <th scope="col" className="px-4 py-2">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-bg/50">
                {/* USER INFORMATION */}
                <td className="px-4 py-2">
                  <p className="text-sm font-medium text-heading">
                    {user.name || user.username || "Unnamed user"}
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    {user.email || "No email"}
                  </p>

                  {user.username && user.name && (
                    <p className="mt-0.5 text-sm text-muted">
                      {user.username}
                    </p>
                  )}
                </td>

                {/* PHONE NUMBER */}
                <td className="whitespace-nowrap px-4 py-2 text-sm text-body">
                  {user.phone || "-"}
                </td>

                {/* ACCOUNT STATUS */}
                <td className="px-4 py-2">
                  <span className="text-sm  text-muted">
                    {user.status || "-"}
                  </span>
                </td>

                {/* USER ROLE */}
                <td className="px-4 py-2">
                  <span className="text-sm text-muted">
                    {(user.role || "Unknown").replaceAll("_", " ")}
                  </span>
                </td>

                {/* PROFILE ACTION */}
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-sidebar transition-colors hover:bg-bg hover:text-heading"
                  >
                    <FileUser size={16} strokeWidth={1.8} />
                     Profile
                  </button>
                </td>
              </tr>
            ))}

            {/* EMPTY STATE */}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User profile modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          currentUserRole={currentUserRole}
          onChangeRole={handleChangeRole}
          onToggleStatus={handleChangeStatus}
        />
      )}
    </>
  );
}
