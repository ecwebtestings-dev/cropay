
import { useState, useEffect } from "react";
import {
  PanelLeftClose,
  PanelRightClose,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMenuForRole } from "../../config/Navigation";
import Images from "../../assets/images/images";

function useIsDesktop() {
  const query = "(min-width: 768px)";

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(query).matches
      : true,
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
  const { user } = useAuth();
  const isDesktop = useIsDesktop();

  const userRole = user?.role?.toLowerCase();
  const isCollapsed = isDesktop && collapsed;
  const menuGroups = getMenuForRole(userRole);

  // CLOSE THE MOBILE DRAWER WHEN SWITCHING TO DESKTOP.
  useEffect(() => {
    if (isDesktop && mobileOpen) {
      onMobileClose();
    }
  }, [isDesktop, mobileOpen, onMobileClose]);

  // LOCK PAGE SCROLLING WHILE THE MOBILE DRAWER IS OPEN.
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

  // NAVIGATE TO THE SELECTED PAGE.
  const navigate = (id) => {
    onPageChange(id);

    if (!isDesktop) {
      onMobileClose();
    }
  };

  // HANDLE DESKTOP COLLAPSE AND MOBILE CLOSE SEPARATELY.
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
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[260px] max-w-[85vw]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:z-auto md:max-w-none md:translate-x-0
          ${isCollapsed ? "md:w-[64px]" : "md:w-[260px]"}
          flex h-full shrink-0 flex-col overflow-hidden
          border border-border bg-bg text-body
          transition-[transform,width] duration-200 ease-in-out
        `}
      >
        {/* HEADER */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-border ${
            isCollapsed ? "justify-center px-0" : "justify-between px-5"
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={handleHeaderToggle}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-sm text-muted transition-colors hover:bg-card hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              <PanelRightClose className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <img src={Images.logo} alt="Logo" className="h-13 w-13" />
                <p></p>
              </div>

              <button
                type="button"
                onClick={handleHeaderToggle}
                aria-label={isDesktop ? "Collapse sidebar" : "Close menu"}
                title={isDesktop ? "Collapse sidebar" : "Close menu"}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
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
        <nav className="custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden px-3 py-5">
          {menuGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-xs  uppercase tracking-wider text-sidebar">
                  {group.label}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = currentPage === item.id;
                  const Icon = item.Icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-5 w-full items-center rounded-md px-3 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent ${
                        isCollapsed ? "justify-center" : "justify-start"
                      } ${
                        isActive
                          ? "bg-primary-500/10 font-semibold text-sidebar"
                          : "text-body hover:bg-card hover:text-sidebar"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 font-semibold ${
                          isActive ? "text-sidebar" : "text-muted"
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="ml-3 truncate whitespace-nowrap text-sm">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* USER PROFILE */}
        <div className="shrink-0 border-t border-border p-3">
          <div
            className={`flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-card ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
           
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
