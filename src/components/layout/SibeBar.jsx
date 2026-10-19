
import { useState, useEffect } from "react";
import {
  Sprout,
  ChevronDown,
  PanelLeftClose,
  PanelRightClose,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMenuForRole } from "../../config/Navigation";

function useIsDesktop() {
  const query = "(min-width: 768px)";

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(query).matches
      : true
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

  const visibleMenuItems = getMenuForRole(userRole);

  // Close the mobile drawer when switching to desktop.
  useEffect(() => {
    if (isDesktop && mobileOpen) {
      onMobileClose();
    }
  }, [isDesktop, mobileOpen, onMobileClose]);

  // Lock page scrolling while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onMobileClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, isDesktop, onMobileClose]);


  const navigate = (id) => {
    onPageChange(id);

    if (!isDesktop) {
      onMobileClose();
    }
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

    setOpenMenu((previous) =>
      previous === item.id ? null : item.id
    );
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
        className={`fixed inset-0 z-40 bg-black/30
          transition-opacity duration-300 md:hidden
          ${
            mobileOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-65 max-w-[85vw]
          md:static md:z-auto md:max-w-none md:translate-x-0
          ${isCollapsed ? "md:w-15" : "md:w-65"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex h-full shrink-0 flex-col overflow-hidden
          rounded-r-lg border-r border-border
          bg-bg text-body shadow-sm
          transition-[transform,width] duration-200 ease-in-out
        `}
      >
        {/* BRAND HEADER */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-border
            ${
              isCollapsed
                ? "justify-center px-0"
                : "justify-between px-5"
            }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToogle}
              aria-label="Expand sidebar"
              className="flex h-10 w-10 items-center justify-center
                rounded-xl text-muted transition-colors
                hover:bg-card hover:text-accent
                focus-visible:outline-2 focus-visible:outline-accent"
            >
              <PanelRightClose className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="min-w-0 whitespace-nowrap">
                <h1 className="truncate text-lg font-bold leading-tight text-heading">
                  CropPay
                </h1>

                <p className="truncate text-xs text-muted">
                  Agricultural Savings
                </p>
              </div>

              <button
                type="button"
                onClick={handleHeaderToggle}
                aria-label={
                  isDesktop ? "Collapse sidebar" : "Close menu"
                }
                className="rounded-lg p-2 text-muted
                  transition-colors hover:bg-card hover:text-accent
                  focus-visible:outline-2 focus-visible:outline-accent"
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
          aria-label="Main navigation"
          className="no-scrollbar flex flex-1 flex-col gap-1
            overflow-y-auto overflow-x-hidden px-3 py-5"
        >
          {!isCollapsed && (
            <p className="mb-3 px-3 text-xs font-semibold uppercase
              tracking-wider text-muted">
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
                {/* MAIN NAVIGATION ITEM */}
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  title={isCollapsed ? item.label : undefined}
                  aria-expanded={
                    item.submenu ? isOpen : undefined
                  }
                  className={`
                    flex min-h-10 w-full items-center rounded-lg
                    px-3 py-2 transition-colors duration-200
                    focus-visible:outline-2 focus-visible:outline-accent
                    ${
                      isCollapsed
                        ? "justify-center"
                        : "justify-between"
                    }
                    ${
                      isActive
                        ? "bg-primary-500/10 font-semibold text-sidebar dark:text-body"
                        : childActive
                          ? "bg-card font-medium text-heading"
                          : "text-body hover:bg-card hover:text-shadow-accent"
                    }
                  `}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {Icon && (
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isActive || childActive
                            ? "text-sidebar dark:text-body"
                            : "text-muted"
                        }`}
                      />
                    )}

                    {!isCollapsed && (
                      <span className="truncate whitespace-nowrap text-sm">
                        {item.label}
                      </span>
                    )}
                  </span>

                  {!isCollapsed && item.submenu && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* SUBMENU */}
                {!isCollapsed && item.submenu && isOpen && (
                  <div className="mb-2 ml-5 mt-1 flex flex-col
                    gap-1 border-l border-border pl-3">
                    {item.submenu.map((subItem) => {
                      const isSubActive =
                        currentPage === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          onClick={() => navigate(subItem.id)}
                          aria-current={
                            isSubActive ? "page" : undefined
                          }
                          className={`
                            min-h-9 w-full truncate rounded-md
                            px-3 py-2 text-left text-sm
                            transition-colors
                            focus-visible:outline-2
                            focus-visible:outline-accent
                            ${
                              isSubActive
                                ? "bg-primary-500/10 font-semibold text-accent"
                                : "text-body hover:bg-card hover:text-accent"
                            }
                          `}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* USER PROFILE */}
        <div className="shrink-0 border-t border-border p-3">
          <div
            className={`flex items-center gap-3 rounded-xl p-2
              transition-colors hover:bg-card
              ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center
              justify-center rounded-full bg-primary-500/10 text-accent">
              <Sprout className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-heading">
                  {user?.name || "CropPay User"}
                </p>

                <p className="truncate text-xs capitalize text-muted">
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
