
export const normalizeUser = (user) => {
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

export const filterUsers = (users, { search, role, status }) => {
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
    const matchesStatus = status === "all" || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });
};
