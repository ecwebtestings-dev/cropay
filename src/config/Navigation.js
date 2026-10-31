
import {
  LayoutDashboard,
  Target,
  ArrowLeftRight,
  ShoppingBasket,
  UserRound,
  Settings,
  Users,
  Tags,
  ClipboardList,
  Package,
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
    title: "Saving Category",
    subtitle: "Manage saving categories",
  },
  
  "audit-logs": {
    path: "/admin/audit-logs",
    title: "Logs",
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


  export const MENU = [
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
    {
      id: "savings",
      label: "Savings Accounts",
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
      label: "Sale Requests",
      Icon: ShoppingBasket,
      roles: [NAV_ROLES.FARMER],
    },
    {
      id: "admin-produce-sales",
      label: "Sale Requests",
      Icon: ShoppingBasket,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    {
      id: "all-users",
      label: "Users",
      Icon: Users,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    {
      id: "farmer-accounts",
      label: "Accounts",
      Icon: UserRound,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    {
      id: "categories",
      label: "Categories",
      Icon: Tags,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    {
      id: "all-products",
      label: "Produce",
      Icon: Package,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    {
      id: "audit-logs",
      label: "Audit Logs",
      Icon: ClipboardList,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    
    {
      id: "user_settings",
      label: "Settings",
      Icon: Settings,
      roles: [NAV_ROLES.FARMER],
    },
    {
      id: "settings",
      label: "Settings",
      Icon: Settings,
      roles: [NAV_ROLES.ADMIN, NAV_ROLES.SUPER_ADMIN],
    },
    
  ];


  export function getMenuForRole(role) {
    const normalizedRole = role?.toString().trim().toLowerCase();
    if (!normalizedRole) {
      return [];
    }

    return MENU.filter((item) =>item.roles.includes(normalizedRole),);
  }

  // RETURNS THE PAGE ID MATCHING A URL.
  export function getPageIdFromPath(pathname) {
    if (!pathname) {return null;}

    const normalizedPath =pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    let pathID = null;
    
    for (const [id, page] of Object.entries(PAGES)) {
      const matches = normalizedPath === page.path ||normalizedPath.startsWith(`${page.path}/`);
      if (matches && (!pathID || page.path.length > PAGES[pathID].path.length)) {
        pathID = id;
      }
    }

    return pathID;
  }

  // RETURN PAGE DETAILS 
  export function getPageFromPath(pathname) {
    const pageId = getPageIdFromPath(pathname);

    return pageId ? { id: pageId, ...PAGES[pageId] } : null;
  }
