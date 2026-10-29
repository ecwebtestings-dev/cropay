import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import SideBar from "../layout/SibeBar";
import Header from "../layout/Header";
import { PAGES, getPageIdFromPath } from "../../config/Navigation";

const SIDEBAR_PREFERENCE_KEY = "sidebar_collapsed";

export default function DashboardLayout() {
 
 
  //SIDEBAR OPEN BY DEFAULT.
  const [collapsed, setCollapsed] = useState(() => {
    const savedPreference = localStorage.getItem(SIDEBAR_PREFERENCE_KEY);
    return savedPreference === null ? false : savedPreference === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const currentPage = getPageIdFromPath(pathname);
  const page = PAGES[currentPage] ?? PAGES.dashboard;

  // SAVE TO LOCALSTORAGE
  const handleSidebarToggle = () => {
    setCollapsed((previousCollapsed) => {
      const nextCollapsed = !previousCollapsed;

      localStorage.setItem(SIDEBAR_PREFERENCE_KEY, String(nextCollapsed));

      return nextCollapsed;
    });
  };

  // NAVIGATE TO THE SELECTED PAGE.
  const goTo = (pageId) => {
    const targetPage = PAGES[pageId];

    if (targetPage) {
      navigate(targetPage.path);
    }
  };



  // LOG OUT THE CURRENT USER.
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      //AUTH CONTEXT
    }
  };

  //SCROLL ROUTE CHANGES.
  useEffect(() => {mainRef.current?.scrollTo({ top: 0 });}, [pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-dashboardbg/30">
      <SideBar
        currentPage={currentPage}
        collapsed={collapsed}
        onToogle={handleSidebarToggle}
        onPageChange={goTo}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          title={page.title}
          subtitle={page.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          onProfile={() => goTo("settings")}
          onSettings={() =>
            goTo(user?.role === "farmer" ? "user_settings" : "settings")
          }
          onNotifications={() => goTo("notifications")}
          onLogout={handleLogout}
        />

        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-5"
        >
          {/* RENDER THE CURRENT ROUTE. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
