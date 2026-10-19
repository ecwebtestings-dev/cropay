
import { PATHS } from "../routes/paths";


export const ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// Dashboard destination after login
export const ROLE_HOME = {
  [ROLES.FARMER]: PATHS.dashboard,
  [ROLES.ADMIN]: PATHS.adminDashboard,
  [ROLES.SUPER_ADMIN]: PATHS.adminDashboard,
};

export const ROLE_PERMISSIONS = {
  [ROLES.FARMER]: [
    "view_dashboard",
    "manage_own_savings",
    "view_own_transactions",
    "record_produce_sales",
    "view_own_notifications",
    "manage_own_profile",
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

// Normalize role values
const normalizeRole = (role) =>
  role?.toString().trim().toLowerCase();

// Check whether a role has a permission
export function hasPermission(role, permission) {
  return (
    ROLE_PERMISSIONS[normalizeRole(role)]?.includes(permission) ??
    false
  );
}

// Get the destination for a role
export function getRoleDestination(role) {
  return ROLE_HOME[normalizeRole(role)] ?? PATHS.login;
}
