import { PAGES } from "./Navigation";

export const ROLES={
    FARMER:"farmer",
    ADMIN:"admin",
    SUPER_ADMIN:"super_admin",
};

//DASHBOARD DESTINATION PATHS AFTER LOGIN
export const ROLE_HOME={
    [ROLES.FARMER]: PAGES.dashboard.path,
    [ROLES.ADMIN]:PAGES.dashboard.path,
    [ROLES.SUPER_ADMIN]:PAGES.dashboard.path,
}

export const ROLE_PERMISSIONS={

    [ROLES.FARMER]:[
        "view_dashboard",
        "manage_own_savings",
        "view_own_transactions",
        "record_produce_sales",
        "view_own_notifications",
        "manage_own_profile",
    ],
    [ROLES.ADMIN]:[
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
  ] 
}

// NORMALIZE ROLE
const normalizeRole = (role) =>role?.toString().trim().toLowerCase();

// CHECK ROLE AGAINST PERMISSION
export function hasPermission(role, permission) {
  return (
    ROLE_PERMISSIONS[normalizeRole(role)]?.includes(permission) ?? false
  );
}

// GET DESTINATION FOR ROLE
export function getRoleDestination(role) {
  return ROLE_HOME[normalizeRole(role)] ?? "/login";
}