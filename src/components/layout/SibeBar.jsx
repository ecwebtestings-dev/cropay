
import { useEffect, useState } from "react";
import {  PanelLeftClose,PanelRightClose,X,} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMenuForRole } from "../../config/Navigation";
import Images from "../../assets/images/images";

// RESPONSIVE BREAKPOINT FOR DESKTOP 
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

// TRACK WHETHER THE SCREEN IS DESKTOP-SIZED.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      : true,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const updateDesktopState = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => {
      mediaQuery.removeEventListener("change", updateDesktopState);
    };
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
      const isCollapsed = isDesktop && collapsed;
      const userRole = user?.role?.toString().trim().toLowerCase();
      const navigationItems = getMenuForRole(userRole);

      // CLOSE THE MOBILE DRAWER
      useEffect(() => {
        if (isDesktop && mobileOpen) {
          onMobileClose();
        }
      }, [isDesktop, mobileOpen, onMobileClose]);

      // LOCK BACKGROUND SCROLLING
      useEffect(() => {
        if (isDesktop || !mobileOpen) {
          return;
        }
        const previousBodyOverflow = document.body.style.overflow;
        const handleEscapeKey = (event) => {
          if (event.key === "Escape") {
            onMobileClose();
          }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscapeKey);

        return () => {
          document.body.style.overflow = previousBodyOverflow;
          window.removeEventListener("keydown", handleEscapeKey);
        };
      }, [isDesktop, mobileOpen, onMobileClose]);


      // HANDLE NAVIGATION 
      const handleNavigation = (pageId) => {
        onPageChange(pageId);

        if (!isDesktop) {
          onMobileClose();
        }
      };

      
      const handleSidebarToggle = () => {
        if (isDesktop) {
          onToogle();
          return;
        }

        onMobileClose();
      };
      return (
        <>
          {/* MOBILE BACKDROP */}
          <div
            onClick={onMobileClose}
            className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
              mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />

          {/* SIDEBAR CONTAINER */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col overflow-hidden border border-border bg-card text-body
              transition-[transform,width] duration-200 ease-in-out w-[260px] max-w-[85vw]
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:static md:z-auto md:max-w-none md:translate-x-0
              ${isCollapsed ? "md:w-[64px]" : "md:w-[260px]"}
            `}
          >
            {/* SIDEBAR HEADER */}
            <div
              className={`flex h-16 shrink-0 items-center border-b border-border ${
                isCollapsed ? "justify-center px-0" : "justify-between px-5"
              }`}
            >
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={handleSidebarToggle}
                  className="flex h-10 w-10 items-center justify-center rounded-sm text-muted transition-colors hover:bg-card hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <PanelRightClose className="h-5 w-5" />
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={Images.logo}
                      alt="CropPay logo"
                      className="h-13 w-13"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSidebarToggle}
                    className="rounded-sm p-2 text-muted transition-colors hover:cursor-pointer hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
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

            {/*  NAVIGATION MENU */}
            <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-5">
              {navigationItems.map((navigationItem) => {
                const NavigationIcon = navigationItem.Icon;
                const isActive = currentPage === navigationItem.id;

                return (
                  <button
                    key={navigationItem.id}
                    type="button"
                    onClick={() => handleNavigation(navigationItem.id)}
                    title={isCollapsed ? navigationItem.label : ""}
                    className={`flex min-h-10 w-full items-center rounded-md px-3 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } ${
                      isActive
                        ? "bg-primary-500/5 font-semibold text-sidebar"
                        : "text-body hover:bg-card font-semibold hover:text-sidebar"
                    }`}
                  >
                    <NavigationIcon
                      className={`h-4 w-4 shrink-0 ${isActive ? "text-sidebar" : "text-muted"}`}
                    />

                    {!isCollapsed && (
                      <span className="ml-3 truncate whitespace-nowrap text-sm">
                        {navigationItem.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/*  USER INFORMATION */}
            <div className="shrink-0 border-t border-border p-2">
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
