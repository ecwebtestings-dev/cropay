
import { PATHS } from "../routes/paths";

// APPLICATION ROLES
export const ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// DASHBOARD DESTINATION AFTER LOGIN.
export const ROLE_HOME = {
  [ROLES.FARMER]: PATHS.dashboard,
  [ROLES.ADMIN]: PATHS.adminOverview,
  [ROLES.SUPER_ADMIN]: PATHS.adminOverview,
};

// PERMISSIONS ASSIGNED TO EACH ROLE.
export const ROLE_PERMISSIONS = {
  [ROLES.FARMER]: [
    "view_dashboard",
    "manage_own_savings",
    "view_own_transactions",
    "record_produce_sales",
    "view_own_notifications",
    "manage_own_profile",
    "manage_own_settings",
  ],

  [ROLES.ADMIN]: [
    "view_dashboard",
    "view_transactions",
    "view_notifications",
    "manage_users",
    "manage_farmer_accounts",
    "manage_saving_categories",
    "manage_products",
    "view_reports",
    "view_audit_logs",
    "manage_settings",
  ],

  [ROLES.SUPER_ADMIN]: [
    "view_dashboard",
    "view_transactions",
    "view_notifications",
    "manage_users",
    "manage_farmer_accounts",
    "manage_saving_categories",
    "manage_products",
    "view_reports",
    "view_audit_logs",
    "manage_settings",
    "create_admin",
    "demote_admin",
    "manage_admin_privileges",
  ],
};

// NORMALIZES ROLE VALUES.
export const normalizeRole = (role) =>
  role?.toString().trim().toLowerCase() ?? "";

// CHECKS WHETHER A ROLE HAS A PERMISSION.
export function hasPermission(role, permission) {
  const normalizedRole = normalizeRole(role);

  return (
    ROLE_PERMISSIONS[normalizedRole]?.includes(permission) ?? false
  );
}

// RETURNS THE HOME PAGE FOR A ROLE.
export function getRoleDestination(role) {
  const normalizedRole = normalizeRole(role);

  return ROLE_HOME[normalizedRole] ?? PATHS.login;
}

// CHECKS WHETHER A ROLE IS RECOGNIZED.
export function isValidRole(role) {
  return Object.values(ROLES).includes(normalizeRole(role));
}
