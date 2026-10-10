import { useState, useEffect } from "react";

import {
  Sprout,
  LayoutDashboard,
  Target,
  ArrowLeftRight,
  ShoppingBasket,
  Bell,
  UserRound,
  Settings,
  ChevronDown,
  PanelLeftClose,
  Leaf,
  Users,
  Tags,
  BarChart3,
  ClipboardList,
  Package,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const MenuItem = [
  {
    id: "dashboard",
    Icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["farmer", "admin"],
  },
  {
    id: "savings",
    Icon: Target,
    label: "Savings",
    roles: ["farmer"],
  },
  {
    id: "transactions",
    Icon: ArrowLeftRight,
    label: "Transactions",
    roles: ["farmer", "admin"],
  },
  {
    id: "produce",
    Icon: ShoppingBasket,
    label: "Produce Sales",
    roles: ["farmer"],
  },
  {
    id: "notifications",
    Icon: Bell,
    label: "Notifications",
    roles: ["farmer", "admin"],
  },
  {
    id: "profile",
    Icon: UserRound,
    label: "My Profile",
    roles: ["farmer", "admin"],
  },

  // Administrator menu
  {
    id: "user-management",
    Icon: Users,
    label: "User Management",
    roles: ["admin"],
    submenu: [
      { id: "all-users", label: "All Users" },
      { id: "farmer-accounts", label: "Farmer Accounts" },
    ],
  },
  {
    id: "categories",
    Icon: Tags,
    label: "Saving Categories",
    roles: ["admin"],
  },
  {
    id: "products",
    Icon: Package,
    label: "Products",
    roles: ["admin"],
    submenu: [
      { id: "all-products", label: "All Products" },
      { id: "add-product", label: "Add Product" },
    ],
  },
  {
    id: "reports",
    Icon: BarChart3,
    label: "Reports",
    roles: ["admin"],
  },
  {
    id: "audit-logs",
    Icon: ClipboardList,
    label: "Audit Logs",
    roles: ["admin"],
  },
  {
    id: "settings",
    Icon: Settings,
    label: "Settings",
    roles: ["admin"],
  },
];


function useIsDesktop() {
  const query = "(min-width: 768px)";

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : true
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export default function SideBar({
  currentPage,
  collapsed,
  onPageChange,
  onToogle,
  mobileOpen = false,
  onMobileClose = () => {},
}) {
  const [openMenu, setOpenMenu] = useState(null);

  const { user } = useAuth();
  const isDesktop = useIsDesktop();

  const userRole = user?.role?.toLowerCase();


  const isCollapsed = collapsed && isDesktop;

  // Show only items assigned to the logged-in user's role.
  const visibleMenuItems = MenuItem.filter((item) =>
    item.roles.includes(userRole)
  );

  // Close open submenus when sidebar collapses.
  

  // Close the drawer when the screen grows to desktop size.
  useEffect(() => {
    if (isDesktop && mobileOpen) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // While the mobile drawer is open: lock page scroll and allow Esc to close.
  useEffect(() => {
    if (!mobileOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onMobileClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen, isDesktop]);

  const navigate = (id) => {
    onPageChange(id);
    if (!isDesktop) onMobileClose();
  };

  const handleItemClick = (item) => {
    if (!item.submenu) {
      navigate(item.id);
      return;
    }

    if (isCollapsed) {
      onToogle();
      setOpenMenu(item.id);
      return;
    }

    setOpenMenu((previous) => (previous === item.id ? null : item.id));
  };

  const handleHeaderToggle = () => {
    if (isDesktop) {
      onToogle();
    } else {
      onMobileClose();
    }
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      <div
        onClick={onMobileClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-sidebar/60 transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw]
          md:static md:z-auto md:max-w-none md:translate-x-0
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex h-full shrink-0 flex-col overflow-hidden
        bg-sidebar text-white
        transition-[transform,width] duration-300 ease-in-out
        `}
      >
        {/* BRAND */}
        <div
          className={`flex h-16 shrink-0 items-center ${
            isCollapsed ? "justify-center px-0" : "justify-between px-5"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToogle}
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-white/15 transition-colors hover:bg-white/25
                focus-visible:outline-2 focus-visible:outline-white"
            >
              <Leaf className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="min-w-0 whitespace-nowrap">
                <h1 className="truncate text-lg font-bold leading-tight text-white">
                  CropPay
                </h1>

                <p className="truncate text-xs text-white/70">
                  Agricultural Savings
                </p>
              </div>

              <button
                type="button"
                onClick={handleHeaderToggle}
                aria-label={isDesktop ? "Collapse sidebar" : "Close menu"}
                className="rounded-lg p-2 text-white/80 transition-colors
                  hover:bg-white/10 hover:text-white
                  focus-visible:outline-2 focus-visible:outline-white"
              >
                {isDesktop ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* NAVIGATION */}
        <nav
          className="no-scrollbar flex flex-1 flex-col gap-1
            overflow-y-auto overflow-x-hidden px-3 py-4"
          
        >
          {!isCollapsed && (
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Main menu
            </p>
          )}

          {visibleMenuItems.map((item) => {
            const childActive = item.submenu?.some(
              (subItem) => subItem.id === currentPage
            );

            const isActive = currentPage === item.id;
            const isOpen = openMenu === item.id;
            const Icon = item.Icon;

            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  title={isCollapsed ? item.label : undefined}
                  aria-expanded={item.submenu ? isOpen : undefined}
                  className={`flex min-h-11 w-full items-center px-3 py-2.5
                    transition-colors duration-200
                    focus-visible:outline-2 focus-visible:outline-white
                    ${isCollapsed ? "justify-center" : "justify-between"}
                    ${
                      isActive
                        ? "bg-primary-900 text-white shadow-md"
                        : childActive
                          ? "bg-white/10 text-white"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" />

                    {!isCollapsed && (
                      <span className="truncate whitespace-nowrap text-sm">
                        {item.label}
                      </span>
                    )}
                  </span>

                  {!isCollapsed && item.submenu && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* SUBMENU */}
                {!isCollapsed && item.submenu && isOpen && (
                  <div className="mb-1 ml-5 mt-1 flex flex-col gap-0.5 border-l border-white/15 pl-4">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        type="button"
                        onClick={() => navigate(subItem.id)}
                        className={`min-h-10 w-full truncate px-3 py-2 text-left text-sm
                          transition-colors focus-visible:outline-2
                          focus-visible:outline-white
                          ${
                            currentPage === subItem.id
                              ? "bg-primary-500 font-semibold text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* USER PROFILE */}
        <div className="shrink-0 border-t border-white/15 p-2">
          <div
            className={`flex items-center gap-3 rounded-xl p-2 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Sprout className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name || "CropPay User"}
                </p>

                <p className="truncate text-xs capitalize text-white/70">
                  {userRole || "No role assigned"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}