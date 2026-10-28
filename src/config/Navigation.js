
import {
  LayoutDashboard,
  Target,
  ArrowLeftRight,
  ShoppingBasket,
  UserRound,
  Settings,
  Users,
  Tags,
  BarChart3,
  ClipboardList,
  Package,
  Bell,
} from "lucide-react";

// PAGES, URLS, TITLES, AND SUBTITLES.
export const PAGES = {
  dashboard: {
    path: "/dashboard",
    title: "Dashboard",
    subtitle: "Manage your workspace here",
  },
  "admin-dashboard": {
    path: "/admin/dashboard",
    title: "Dashboard",
    subtitle: "Overview of the whole system",
  },
  savings: {
    path: "/savings",
    title: "Savings Goals",
    subtitle: "Set and track your savings goals",
  },
  transactions: {
    path: "/transactions",
    title: "Transactions",
    subtitle: "View all your financial transactions",
  },
  "admin-transactions": {
    path: "/admin/transactions",
    title: "Payment Transactions",
    subtitle: "Monitor every user's payments",
  },
  produce: {
    path: "/producesales",
    title: "Produce Sales",
    subtitle: "Record your produce sales",
  },
  "admin-produce-sales": {
  path: "/admin/producesales",
  title: "Produce Sales",
  subtitle: "Review farmer requests and manage inspections",
},

"all-products": {
  path: "/admin/productsales",
  title: "Products",
  subtitle: "Manage Agricultural Products",
},
  notifications: {
    path: "/notifications",
    title: "Notifications",
    subtitle: "Stay updated with your account activities",
  },
  profile: {
    path: "/profile",
    title: "My Profile",
    subtitle: "Manage your personal information",
  },
  user_settings: {
    path: "/settings",
    title: "Settings",
    subtitle: "Manage your personal preferences",
  },
  "all-users": {
    path: "/admin/users",
    title: "Manage Users",
    subtitle: "View and manage system users",
  },
  "farmer-accounts": {
    path: "/admin/accounts",
    title: "Farmer Accounts",
    subtitle: "View and manage farmer accounts",
  },
  categories: {
    path: "/admin/categories",
    title: "Saving Categories",
    subtitle: "Manage saving categories",
  },
  reports: {
    path: "/admin/reports",
    title: "System Reports",
    subtitle: "View and download system reports",
  },
  "audit-logs": {
    path: "/admin/audit-logs",
    title: "Audit Logs",
    subtitle: "Track activity across the system",
  },
  settings: {
    path: "/admin/settings",
    title: "System Settings",
    subtitle: "Manage system preferences",
  },
};

// USER ROLES.
export const NAV_ROLES = {
  FARMER: "farmer",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// MENU ITEMS.
export const MENU = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        Icon: LayoutDashboard,
        roles: [NAV_ROLES.FARMER],
      },
      {
        id: "admin-dashboard",
        label: "Dashboard",
        Icon: LayoutDashboard,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "finances",
    label: "Finances",
    items: [
      {
        id: "savings",
        label: "Savings Goals",
        Icon: Target,
        roles: [NAV_ROLES.FARMER],
      },
      {
        id: "transactions",
        label: "Transactions",
        Icon: ArrowLeftRight,
        roles: [NAV_ROLES.FARMER],
      },
      {
        id: "admin-transactions",
        label: "Transactions",
        Icon: ArrowLeftRight,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
      {
        id: "produce",
        label: "Produce Sales",
        Icon: ShoppingBasket,
        roles: [NAV_ROLES.FARMER],
      },
      {
        id: "admin-produce-sales",
        label: "Produce Sales",
        Icon: ShoppingBasket,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "user-management",
    label: "User Management",
    items: [
      {
        id: "all-users",
        label: "All Users",
        Icon: Users,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
      {
        id: "farmer-accounts",
        label: "Farmer Accounts",
        Icon: UserRound,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "products-categories",
    label: "Products & Categories",
    items: [
      {
        id: "categories",
        label: "Saving Categories",
        Icon: Tags,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
      {
        id: "all-products",
        label: "Produce",
        Icon: Package,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports & Monitoring",
    items: [
      {
        id: "reports",
        label: "Reports",
        Icon: BarChart3,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        Icon: ClipboardList,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        Icon: Bell,
        roles: [
          NAV_ROLES.FARMER,
          NAV_ROLES.ADMIN,
          NAV_ROLES.SUPER_ADMIN,
        ],
      },
      {
        id: "profile",
        label: "My Profile",
        Icon: UserRound,
        roles: [NAV_ROLES.FARMER],
      },
      {
        id: "user_settings",
        label: "Settings",
        Icon: Settings,
        roles: [NAV_ROLES.FARMER],
      },
    ],
  },
  {
    id: "system-settings",
    label: "System Settings",
    items: [
      {
        id: "settings",
        label: "Settings",
        Icon: Settings,
        roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
      },
    ],
  },
];

// RETURNS MENU CATEGORIES CONTAINING ITEMS ALLOWED FOR THE ROLE.
export function getMenuForRole(role) {
  const normalizedRole = role?.toString().trim().toLowerCase();

  if (!normalizedRole) {
    return [];
  }

  return MENU.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.roles.includes(normalizedRole),
    ),
  })).filter((group) => group.items.length > 0);
}

// RETURNS THE PAGE ID MATCHING A URL.
export function getPageIdFromPath(pathname) {
  if (!pathname) {
    return null;
  }

  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  let bestId = null;

  for (const [id, page] of Object.entries(PAGES)) {
    const matches =
      normalizedPath === page.path ||
      normalizedPath.startsWith(`${page.path}/`);

    if (
      matches &&
      (!bestId || page.path.length > PAGES[bestId].path.length)
    ) {
      bestId = id;
    }
  }

  return bestId;
}

// RETURNS PAGE DETAILS MATCHING A URL.
export function getPageFromPath(pathname) {
  const pageId = getPageIdFromPath(pathname);

  return pageId ? { id: pageId, ...PAGES[pageId] } : null;
}
