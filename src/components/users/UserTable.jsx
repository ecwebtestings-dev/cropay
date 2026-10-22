
import { FileUser } from "lucide-react";
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";
import {suspendUser,unsuspendUser,promoteUserToAdmin,demoteAdmin,updateUser,} from "../../api/users";

export default function UserTable({users: usersProp,currentUserRole,setUsers,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionError, setActionError] = useState("");

  // Ensure users is always an array
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
    setActionError("");

    try {
      if (status === "suspended") {
        await suspendUser(userId);
      } else if (status === "active") {
        await unsuspendUser(userId);
      } else {
        throw new Error("Invalid account status.");
      }

      updateUserState(userId, { status });
    } catch (error) {
      console.error("Failed to change user status:", error);

      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update account status."
      );

      throw error;
    }
  };

  // Promote a farmer to admin or demote an admin to farmer
  const handleChangeRole = async (userId, role) => {
    setActionError("");

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

      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user role."
      );

      throw error;
    }
  };

  // Update user information
  const handleUpdateUser = async (userId, userData) => {
    setActionError("");

    try {
      const response = await updateUser(userId, userData);

      const updatedUser =
        response.data?.data?.user ??
        response.data?.data ??
        response.data?.user ??
        userData;

      updateUserState(userId, updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error);

      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user information."
      );

      throw error;
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        {actionError && (
          <div
            className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {actionError}
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead className="bg-bg gap-2">
            <tr>
              <th className="px-4 py-3 text-xs">USER</th>
              <th className="px-4 py-3 text-xs">PHONE</th>
              <th className="px-4 py-3 text-xs">STATUS</th>
              <th className="px-4 py-3 text-xs">ROLE</th>
              <th className="px-4 py-3 text-xs">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-5">
           
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-1">
                  <div className="text-xs">
                    {user.name || user.username || "Unnamed user"}
                  </div>

                  <div className="text-xs text-gray-500">
                    {user.email || "No email"}
                  </div>

                  {user.username && user.name && (
                    <div className="text-xs text-gray-500">
                      {user.username}
                    </div>
                  )}
                </td>

                <td className="px-4 text-xs py-1">
                  {user.phone || "0777891441"}
                </td>

                <td className="px-4 py-1">
                  {user.status || "Unknown"}
                </td>

                <td className="px-4 py-1">
                  {user.role || "Unknown"}
                </td>

                <td className="px-4 py-1">
                  <button
                    type="button"
                    onClick={() => {setActionError(""); setSelectedUser(user);}}
                    className="inline-flex items-center text-muted gap-2 rounded-md px-3 py-2 text-sm  hover:bg-gray-50 hover:cursor-pointer"
                    
                  >

                    <FileUser size={16}/>
                    Full Profile
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500"
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
          onSave={handleUpdateUser}
          onChangeRole={handleChangeRole}
          onToggleStatus={handleChangeStatus}
        />
      )}
    </>
  );
}
