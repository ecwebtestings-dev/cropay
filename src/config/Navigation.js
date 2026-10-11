import {
  LayoutDashboard,
  Target,
  ArrowLeftRight,
  ShoppingBasket,
  Bell,
  UserRound,
  Settings,
  Users,
  Tags,
  BarChart3,
  ClipboardList,
  Package,
} from "lucide-react";

// ───────────────────────────────────────────────────────────────
// PAGES: URL, title and subtitle for every page (unchanged).
// ───────────────────────────────────────────────────────────────
export const PAGES = {
  dashboard: {
    path: "/dashboard",
    title: "Dashboard",
    subtitle: "Manage your workspace here",
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
  produce: {
    path: "/produce-sales",
    title: "Produce Sales",
    subtitle: "Record your produce sales",
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

  // Admin pages
  "all-users": {
    path: "/admin/users",
    title: "Manage Users",
    subtitle: "Add and manage system users",
  },
  "farmer-accounts": {
    path: "/admin/farmers",
    title: "Farmer Accounts",
    subtitle: "View and manage farmer accounts",
  },
  categories: {
    path: "/admin/categories",
    title: "Saving Categories",
    subtitle: "Manage saving categories",
  },
  "all-products": {
    path: "/admin/products",
    title: "Products",
    subtitle: "Manage the product catalogue",
  },
  "add-product": {
    path: "/admin/products/new",
    title: "Add Product",
    subtitle: "Create a new product",
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
    title: "Settings",
    subtitle: "Configure the system",
  },
};

// ───────────────────────────────────────────────────────────────
// MENU: what the sidebar shows, and which roles can see each item.
// Every `id` here must exist in PAGES (except submenu parents,
// which only open and close).
// To show an item to more roles, add them to its `roles` array.
// ───────────────────────────────────────────────────────────────
export const MENU = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard, roles: ["farmer", "admin"] },
  { id: "savings", label: "Savings", Icon: Target, roles: ["farmer"] },
  { id: "transactions", label: "Transactions", Icon: ArrowLeftRight, roles: ["farmer", "admin"] },
  { id: "produce", label: "Produce Sales", Icon: ShoppingBasket, roles: ["farmer"] },
  { id: "notifications", label: "Notifications", Icon: Bell, roles: ["farmer", "admin"] },
  { id: "profile", label: "My Profile", Icon: UserRound, roles: ["farmer", "admin"] },

  // Administrator menu
  {
    id: "user-management",
    label: "User Management",
    Icon: Users,
    roles: ["admin"],
    submenu: [
      { id: "all-users", label: "All Users" },
      { id: "farmer-accounts", label: "Farmer Accounts" },
    ],
  },
  { id: "categories", label: "Saving Categories", Icon: Tags, roles: ["admin"] },
  {
    id: "products",
    label: "Products",
    Icon: Package,
    roles: ["admin"],
    submenu: [
      { id: "all-products", label: "All Products" },
      { id: "add-product", label: "Add Product" },
    ],
  },
  { id: "reports", label: "Reports", Icon: BarChart3, roles: ["admin"] },
  { id: "audit-logs", label: "Audit Logs", Icon: ClipboardList, roles: ["admin"] },
  { id: "settings", label: "Settings", Icon: Settings, roles: ["admin"] },
];

// The menu items a given role is allowed to see.
export function getMenuForRole(role) {
  const normalizedRole = role?.toString().trim().toLowerCase();
  return MENU.filter((item) => item.roles.includes(normalizedRole));
}

// "/admin/products/new" -> "add-product". The longest matching path wins,
// so "/admin/products/new" isn't mistaken for "/admin/products".
export function getPageIdFromPath(pathname) {
  let bestId = null;

  for (const [id, page] of Object.entries(PAGES)) {
    const matches =
      pathname === page.path || pathname.startsWith(`${page.path}/`);

    if (matches && (!bestId || page.path.length > PAGES[bestId].path.length)) {
      bestId = id;
    }
  }

  return bestId;
}